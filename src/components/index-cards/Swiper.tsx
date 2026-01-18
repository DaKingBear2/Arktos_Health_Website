import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarDay,
  FaQuestion,
} from "react-icons/fa";

type Props = {
  cards: {
    header: string;
    subText?: string;
    image?: string;
    link?: string;
  }[];
};

const getTodayIndex = () => {
  const today = new Date();
  const year = today.getFullYear();
  const startOfYear = new Date(year, 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  let leapYearAdjustment = 0;
  if (
    ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) &&
    dayOfYear > 59
  ) {
    leapYearAdjustment = 1;
  }

  return dayOfYear + leapYearAdjustment - 1;
};

const ConversationSwiper = ({ cards }: Props) => {
  const todayIndex = getTodayIndex();
  const [swiper, setSwiper] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(todayIndex);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0, 0);
      setCurrentIndex(0);
      swiper.on("slideChange", () => setCurrentIndex(swiper.realIndex));
    }
  }, [swiper]);

  return (
    <div className="conversation-swiper">
      <Swiper
        onSwiper={setSwiper}
        onSlideChange={(s) => setCurrentIndex(s.realIndex)}
        spaceBetween={10}
        slidesPerView={1}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="col-10 sm:col-8 md:col-6 mx-auto p-4 my-12 min-h-64 text-center content-center glass rounded-lg">
              <h3 className="pb-4">{card.header}</h3>
              {card.subText ? card.link ? <a href={card.link} target="_blank"><p>{card.subText}</p></a> : <p>{card.subText}</p>: null}
              { card.image && (
                <div className="col basis-2/3 p-2 min-w-72">
                  <div className="glass rounded-lg intersect:animate-fadeDown opacity-0">
                    <img className="w-full rounded-lg" src={card.image} alt={card.header} width={1920} height={1080}></img>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <nav className="flex justify-center pb-8">
        <div className="flex-col glass justify-center rounded-md p-2 m-2 w-48">
          <div className="row items-center">
            <div
              className="cursor-pointer col-4 p-0 text-txt-p dark:text-darkmode-txt-p text-center align-middle"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous card"
            >
              <FaArrowLeft className={"m-2 inline-block"} />
            </div>
            <div className="col-4 p-0 text-txt-p dark:text-darkmode-txt-p text-center">
              <input
                type="number"
                className="w-16 text-center bg-transparent border-none"
                min="1"
                max={cards.length}
                value={currentIndex + 1}
                onChange={(e) => {
                  const newIndex = parseInt(e.target.value, 10) - 1;
                  if (
                    !isNaN(newIndex) &&
                    newIndex >= 0 &&
                    newIndex < cards.length
                  ) {
                    swiper?.slideTo(newIndex);
                    setCurrentIndex(newIndex);
                  }
                }}
                aria-label="Jump to card number"
              />
            </div>
            <div
              className="cursor-pointer col-4 p-0 text-txt-p dark:text-darkmode-txt-p text-center"
              onClick={() => swiper?.slideNext()}
              aria-label="Next card"
            >
              <FaArrowRight className="m-2 inline-block" />
            </div>
          </div>
          <div className="row content-center justify-center">
            <div
              className="cursor-pointer col-4 p-0 text-txt-p dark:text-darkmode-txt-p text-center"
              onClick={() => swiper?.slideTo(todayIndex)}
              title="Jump to today's card"
              aria-label="Jump to today's card"
            >
              <FaCalendarDay className={"m-2 inline-block"} />
            </div>
            <div
              className="cursor-pointer col-4 p-0 text-txt-p dark:text-darkmode-txt-p text-center"
              onClick={() =>
                swiper?.slideTo(Math.floor(Math.random() * cards.length))
              }
              title="Jump to random card"
              aria-label="Jump to random card"
            >
              <FaQuestion className={"m-2 inline-block"} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ConversationSwiper;
