import { SideBySideMagnifier } from "react-image-magnifiers";

const ImageMagnifier = ({ product }) => (
    <SideBySideMagnifier
        imageSrc={`${import.meta.env.VITE_APP_DOMAIN}${product.image}`}
        largeImageSrc={`${import.meta.env.VITE_APP_DOMAIN}${product.image}`}
        alwaysInPlace={true}
        overlayBoxOpacity={0.8}
        cursorStyle="crosshair"
        className="w-full"
    />
);

export default ImageMagnifier;