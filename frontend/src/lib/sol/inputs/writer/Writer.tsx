import { cls } from '@/lib/sol/cls'
import { cn } from '@/utils/react-ext'
import isHotkey from 'is-hotkey'
import {
	AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, CodeIcon, Heading1Icon, Heading2Icon, ItalicIcon, ListIcon, ListOrderedIcon, QuoteIcon, UnderlineIcon
} from 'lucide-react'
import React, {
	type KeyboardEvent, type MouseEvent, useCallback, useEffect, useMemo
} from 'react'
import {
	type Descendant,
	Editor,
	Element as SlateElement,
	Transforms,
	createEditor
} from 'slate'
import { withHistory } from 'slate-history'
import {
	Editable,
	type RenderElementProps,
	type RenderLeafProps,
	Slate,
	useSlate,
	withReact
} from 'slate-react'
import { useDebouncedCallback } from 'use-debounce'
import { WriterButton, WriterToolbar } from './writerComponents'
import type {
	CustomEditor,
	CustomElement,
	CustomElementType,
	CustomElementWithAlign,
	CustomTextKey
} from './writerTypes'

const HOTKEYS: Record<string, CustomTextKey> = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
	'mod+`': 'code'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const
const TEXT_ALIGN_TYPES = [
	'left', 'center', 'right', 'justify'
] as const

type AlignType = (typeof TEXT_ALIGN_TYPES)[number]
type ListType = (typeof LIST_TYPES)[number]
type CustomElementFormat = CustomElementType | AlignType | ListType

const isEmpty = (value: Descendant[] | undefined | null): boolean => {
	if (!value || value.length === 0) return true
	if (value.length > 1) return false
	const first = value[0]
	if (first && 'text' in first && !first.text.trim()) return true
	return false
}

export type PWriter = {
	placeholder?: string,
	className?: string,
	solTheme?: Parameters<typeof cls.textInputVariants2D>[0],
	initialValue: Descendant[] | undefined | null,
	onDebouncedValueChange: (value: Descendant[]) => void,
	minHeightPx?: number,
	readonly?: boolean
}
export const Writer: React.FC<PWriter> = ({
	placeholder, className, solTheme, initialValue, onDebouncedValueChange, minHeightPx, readonly
}) => {
	const renderElement = useCallback(
		(props: RenderElementProps) => <Element {...props} />,
		[]
	)
	const renderLeaf = useCallback(
		(props: RenderLeafProps) => <Leaf {...props} />,
		[]
	)
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	const debouncedUpdate = useDebouncedCallback(onDebouncedValueChange, 300)
	useEffect(() => {
		return () => debouncedUpdate.flush() // handle save when dismounting if needed
	}, [])

	return (
		<div className='group/writer'>
			<Slate
				editor={editor}
				initialValue={isEmpty(initialValue) ? [ { text: placeholder || 'Write rich text here..' } ] : initialValue!}
				onValueChange={debouncedUpdate}
			>
				<WriterToolbar>
					<MarkButton format="bold" icon={BoldIcon} />
					<MarkButton format="italic" icon={ItalicIcon} />
					<MarkButton format="underline" icon={UnderlineIcon} />
					<MarkButton format="code" icon={CodeIcon} />
					<BlockButton format="heading-one" icon={Heading1Icon} />
					<BlockButton format="heading-two" icon={Heading2Icon} />
					<BlockButton format="block-quote" icon={QuoteIcon} />
					<BlockButton format="numbered-list" icon={ListOrderedIcon} />
					<BlockButton format="bulleted-list" icon={ListIcon} />
					<BlockButton format="left" icon={AlignLeftIcon} />
					<BlockButton format="center" icon={AlignCenterIcon} />
					<BlockButton format="right" icon={AlignRightIcon} />
					<BlockButton format="justify" icon={AlignJustifyIcon} />
				</WriterToolbar>
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder={placeholder || 'Write something...'}
					spellCheck
					autoFocus
					readOnly={readonly}
					className={cn(
						'text-sm/relaxed',
						'[&_[data-slate-placeholder="true"]]:relative [&_[data-slate-placeholder="true"]]:translate-y-1.5 [&_[data-slate-placeholder="true"]]:font-normal',
						// placeholder colour (opacity that they override with inline styles) can be done using `renderPlaceholder` prop
						cls.textInputVariants2D(solTheme),
						className
					)}
					style={{
						minHeight: minHeightPx ?? 100
					}}
					onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
						for (const hotkey in HOTKEYS) {
							if (isHotkey(hotkey, event as any)) {
								event.preventDefault()
								const mark = HOTKEYS[hotkey]
								toggleMark(editor, mark)
							}
						}
					}}
				/>
			</Slate>
		</div>

	)
}

const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
	const isActive = isBlockActive(
		editor,
		format,
		isAlignType(format) ? 'align' : 'type'
	)
	const isList = isListType(format)

	Transforms.unwrapNodes(editor, {
		match: (n) => !Editor.isEditor(n)
			&& SlateElement.isElement(n)
			&& isListType(n.type)
			&& !isAlignType(format),
		split: true
	})
	let newProperties: Partial<SlateElement>
	if (isAlignType(format)) {
		newProperties = {
			align: isActive ? undefined : format
		}
	} else {
		newProperties = {
			type: isActive ? 'paragraph' : isList ? 'list-item' : format
		}
	}
	Transforms.setNodes<SlateElement>(editor, newProperties)

	if (!isActive && isList) {
		const block = { type: format, children: [] }
		Transforms.wrapNodes(editor, block)
	}
}

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

const isBlockActive = (
	editor: CustomEditor,
	format: CustomElementFormat,
	blockType: 'type' | 'align' = 'type'
) => {
	const { selection } = editor
	if (!selection) return false

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n) => {
				if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
					if (blockType === 'align' && isAlignElement(n)) {
						return n.align === format
					}
					return n.type === format
				}
				return false
			}
		})
	)

	return !!match
}

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
	const marks = Editor.marks(editor)
	return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
	const style: React.CSSProperties = {}
	if (isAlignElement(element)) {
		style.textAlign = element.align as AlignType
	}
	switch (element.type) {
		case 'block-quote':
			return (
				<blockquote style={style} {...attributes}>
					{children}
				</blockquote>
			)
		case 'bulleted-list':
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			)
		case 'heading-one':
			return (
				<h1 style={style} {...attributes}>
					{children}
				</h1>
			)
		case 'heading-two':
			return (
				<h2 style={style} {...attributes}>
					{children}
				</h2>
			)
		case 'list-item':
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			)
		case 'numbered-list':
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			)
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			)
	}
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.code) {
		children = <code>{children}</code>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	return <span {...attributes}>{children}</span>
}

interface BlockButtonProps {
	format: CustomElementFormat,
	icon: React.FC<{ className?: string }>
}

const BlockButton = ({ format, icon: IconComp }: BlockButtonProps) => {
	const editor = useSlate()
	return (
		<WriterButton
			active={isBlockActive(
				editor,
				format,
				isAlignType(format) ? 'align' : 'type'
			)}
			onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}
		>
			<IconComp className='size-4' />
		</WriterButton>
	)
}

interface MarkButtonProps {
	format: CustomTextKey,
	icon: React.FC<{ className?: string }>
}

const MarkButton = ({ format, icon: IconComp }: MarkButtonProps) => {
	const editor = useSlate()
	return (
		<WriterButton
			active={isMarkActive(editor, format)}
			onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			<IconComp className='size-4' />
		</WriterButton>
	)
}

const isAlignType = (format: CustomElementFormat): format is AlignType => {
	return TEXT_ALIGN_TYPES.includes(format as AlignType)
}

const isListType = (format: CustomElementFormat): format is ListType => {
	return LIST_TYPES.includes(format as ListType)
}

const isAlignElement = (
	element: CustomElement
): element is CustomElementWithAlign => {
	return 'align' in element
}

const richTextFeaturePreviewInitialValue: Descendant[] = [
	{
		type: 'paragraph',
		children: [
			{ text: 'This is editable ' },
			{ text: 'rich', bold: true },
			{ text: ' text, ' },
			{ text: 'much', italic: true },
			{ text: ' better than a ' },
			{ text: '<textarea>', code: true },
			{ text: '!' }
		]
	},
	{
		type: 'paragraph',
		children: [
			{
				text: "Since it's rich text, you can do things like turn a selection of text "
			},
			{ text: 'bold', bold: true },
			{
				text: ', or add a semantically rendered block quote in the middle of the page, like this:'
			}
		]
	},
	{
		type: 'block-quote',
		children: [ { text: 'A wise quote.' } ]
	},
	{
		type: 'paragraph',
		align: 'center',
		children: [ { text: 'Try it out for yourself!' } ]
	}
]

