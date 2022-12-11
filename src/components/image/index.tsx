import React from 'react';
import {View} from 'react-native';
import {IMAGES} from '../../assets/images';
import {ImageProps} from './ImageInterface';
import {Image} from './styles/ImagesStylesHelper';

const ImageLayout: React.FC<ImageProps> = ({
  source,
  width,
  height,
  position,
  margin,
}) => {
  const {blankRoundImage} = IMAGES;
  const imageSource = source || blankRoundImage;
  return (
    <Image
      source={imageSource}
      width={width}
      height={height}
      position={position}
      margin={margin}
    />
  );
};

export default ImageLayout;
