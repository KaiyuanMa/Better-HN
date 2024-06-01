import { getItem } from "@/lib/api";
import { CommentItem } from "@/lib/types";
import React, { useEffect, useState } from "react";
import ItemHeader from "./ItemHeader";
import Up from "../../public/up.svg";
import CommentSVG from "../../public/comment.svg";

export default function Comment({
  id,
  isChildren,
  isLastChildren,
}: {
  id: number;
  isChildren: boolean;
  isLastChildren: boolean;
}) {
  const [comment, setComment] = useState<CommentItem>();
  const [isHovered, setIsHovered] = useState(false);

  async function fetchData() {
    const _comment = await getItem(id);
    setComment(_comment as CommentItem);
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {comment !== undefined ? (
        <>
          {isChildren ? (
            <div
              className={`threadline flex justify-end align-start relative pointer-events-none ${
                isLastChildren && comment.kids === undefined
                  ? "bg-surface-primary"
                  : ""
              }`}
            >
              <div
                className={`box-border h-4 border-1 border-border-tertiary border-solid border-b-[1px] w-[calc(50%+2.5px)] rounded-bl-[12px] "border-l-[1px]" ${
                  isLastChildren && comment.kids === undefined
                    ? "border-l-[1px]"
                    : ""
                }`}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className="">
            <div className="grid grid-cols-[24px_minmax(0,1fr)] xs:grid-cols-[32px_minmax(0,1fr)]">
              <div className="bg-surface-secondary w-6 h-6 text-text-primary flex justify-center items-center text-sm font-semibold">
                {comment.by[0].toUpperCase()}
              </div>
              <div className="ml-2">
                <ItemHeader by={comment.by} time={comment.time} />
              </div>
            </div>

            <div className="grid grid-cols-[28px_1fr] relative">
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute top-0 left-0 bottom-0 w-6 flex justify-center items-center z-0 cursor-pointer group mb-3"
              >
                {comment.kids !== undefined ? (
                  <div className="w-[1px] h-full group-hover:bg-surface-tertiary bg-surface-secondary" />
                ) : (
                  ""
                )}
              </div>
              <div className="contents">
                <div />
                <div
                  className="story-text-expanded | block text-sm text-text-primary font-light"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                />
              </div>
              <div className="contents">
                <div />
                <div className="flex items-center gap-6 p-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-4 text-text-secondary fill-current">
                      <Up />
                    </div>
                    <span className="text-xs text-text-secondary font-semibold">
                      Up Vote
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="text-text-secondary fill-current text-sm w-[1.1rem]">
                      <CommentSVG />
                    </div>
                    <span className="text-xs text-text-secondary font-semibold">
                      Reply
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`contents w-full ${
                  isHovered
                    ? "[&>.threadline>*]:border-surface-tertiary"
                    : "[&>.threadline>*]:border-primary-primary"
                }`}
              >
                {comment.kids?.map((id, i) => (
                  <Comment
                    id={id}
                    isChildren={true}
                    isLastChildren={comment.kids!.length === i + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}