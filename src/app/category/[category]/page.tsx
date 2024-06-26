"use client";
import Story from "@/components/Story";
import {
  getAsks,
  getBestStories,
  getItem,
  getJobs,
  getNewStories,
  getShows,
  getTopStories,
} from "@/lib/api";
import { BaseItem } from "@/lib/types";
import { useEffect, useState, useRef, useCallback } from "react";
import Loading from "@/components/Loading";

export default function Category({ params }: { params: { category: string } }) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchMore(fetchCount: number) {
    if (items.length !== 0 && items.length >= itemIds.length) return;
    const currIndex = items.length;
    const promises = [];
    for (
      let i = currIndex;
      i <= currIndex + fetchCount && i < itemIds.length;
      i++
    ) {
      promises.push(getItem(itemIds[i]));
    }
    const results = await Promise.all(promises);

    setItems([...items, ...results]);
  }

  async function fetchData() {
    let itemIds: number[] = [];
    switch (params.category) {
      case "top_story":
        itemIds = await getTopStories();
        break;
      case "best_story":
        itemIds = await getBestStories();
        break;
      case "new_story":
        itemIds = await getNewStories();
        break;
      case "ask":
        itemIds = await getAsks();
        break;
      case "show":
        itemIds = await getShows();
        break;
      case "job":
        itemIds = await getJobs();
        break;
    }
    setItemIds(itemIds);
    await fetchMore(9);
    setItems(items);
    setLoading(false);
  }

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          await fetchMore(9);
          setLoading(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, fetchMore]
  );

  return (
    <main>
      {items.map((item) => (
        <div className="border-b border-border-primary" key={item.id}>
          <div className="hover:bg-background-hover my-1 px-4 rounded-md">
            <Story {...item} />
          </div>
        </div>
      ))}
      {loading ? <Loading /> : ""}
      <div ref={lastElementRef} style={{ height: "5px" }}></div>
    </main>
  );
}
