import { cn, type Children } from '@/utils/react-ext'
import { cls, variances } from '../cls'

export const SolBgBackdropContainer: React.FC<Children & {
	/** use either `bgImgAsset` (vite imported src string) or `bgImgURL` */
	bgImgSrc: string,
	clsBgImg?: string,
	bgImgStyle?: React.CSSProperties,
	bgImgAlt?: string,
	bgImgOnClick?: React.MouseEventHandler<HTMLImageElement>,
	bgImgOtherProps?: React.ImgHTMLAttributes<HTMLImageElement>,
	clsContainer?: string,
	footerContent?: React.ReactNode,
	clsFooter?: string,
	footerOtherProps?: React.HTMLAttributes<HTMLDivElement>
}> = ({
	bgImgSrc,
	clsBgImg,
	bgImgStyle,
	bgImgAlt,
	bgImgOnClick,
	bgImgOtherProps,
	clsContainer,
	footerContent,
	clsFooter,
	footerOtherProps,
	children
}) => {
	return <div className={cn('relative w-full h-full bg-black', clsContainer)}>
		<img
			src={bgImgSrc}
			alt={bgImgAlt}
			style={bgImgStyle}
			className={cn('fixed inset-0 object-cover', clsBgImg)}
			onClick={bgImgOnClick}
			{...bgImgOtherProps}
		/>
		{ footerContent && <div {...footerOtherProps} className={cn(variances.use(cls.appFooter, 'on_image'), clsFooter)}>
			{ footerContent }
		</div>}

		{ children }
	</div>
}
