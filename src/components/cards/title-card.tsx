import React, { ReactNode } from 'react';
import Subtitle from '../typography/subtitle';

interface TitleCardProps {
  title: string;
  children: ReactNode;
  topMargin?: string;
  TopSideButtons?: ReactNode;
  imgSrc?: string;
}

function TitleCard({
  title,
  children,
  topMargin,
  TopSideButtons,
  imgSrc,
}: TitleCardProps) {
  return (
    <div
      className={
        'card w-full p-6 bg-base-100 shadow-xl ' + (topMargin || 'mt-6')
      }
    >
      {/* Title for Card */}
      <Subtitle styleClass={TopSideButtons ? 'inline-block' : ''}>
        {imgSrc && (
          <div className="inline-block pr-2">
            <img
              className="inline-block w-12 h-12"
              src="https://cdn-icons-png.flaticon.com/512/174/174883.png"
              alt=""
            />
          </div>
        )}
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons && (
          <div className="inline-block float-right">{TopSideButtons}</div>
        )}
      </Subtitle>

      <div className="divider mt-2"></div>

      {/** Card Body */}
      <div className="h-full w-full pb-6 bg-base-100">{children}</div>
    </div>
  );
}

export default TitleCard;
