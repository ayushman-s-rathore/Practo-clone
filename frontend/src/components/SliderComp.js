import React from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { InClinicData } from '../utils/InClinicData.js';
import SliderCard from './SliderCard.js';

const SliderComp = () => {
    const settings = {
        // dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
      };
    
      return (
        <Slider className='flex w-4/6' {...settings}>
          {InClinicData.map((service, index) => (
          
            <SliderCard
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
        </Slider>
      )
}

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'black' }}
        onClick={onClick}
      />
    );
  };
  
  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'black' }}
        onClick={onClick}
      />
    );
  };

export default SliderComp
