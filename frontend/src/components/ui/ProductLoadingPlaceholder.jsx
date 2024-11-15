import PropTypes from 'prop-types';
import React from 'react';
import ContentLoader from "react-content-loader";

const ProductLoadingPlaceholder = ({ count = 3 }) => {
    const getPlaceholderConfig = (id) => ({
        dimensions: { width: 400, height: 250 },
        rects: [
            { x: 0, y: 0, width: 400, height: 150, rx: 5, ry: 5 },
            { x: 0, y: 165, width: 350, height: 20, rx: 3, ry: 3 },
            { x: 0, y: 195, width: 250, height: 20, rx: 3, ry: 3 },
            { x: 0, y: 225, width: 150, height: 20, rx: 3, ry: 3 }
        ]
    });

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg">
            {[...Array(count)].map((_, index) => {
                const config = getPlaceholderConfig(`placeholder-${index}`);
                return (
                    <li key={`placeholder-${index}`}>
                        <ContentLoader
                            speed={2}
                            width={config.dimensions.width}
                            height={config.dimensions.height}
                            viewBox={`0 0 ${config.dimensions.width} ${config.dimensions.height}`}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            role="presentation"
                            aria-label={`Loading product ${index + 1}`}
                        >
                            {config.rects.map((rect, rectIndex) => (
                                <rect
                                    key={`rect-${rectIndex}`}
                                    {...rect}
                                />
                            ))}
                        </ContentLoader>
                    </li>
                );
            })}
        </ul>
    );
};

ProductLoadingPlaceholder.propTypes = {
    count: PropTypes.number
};

export default React.memo(ProductLoadingPlaceholder);