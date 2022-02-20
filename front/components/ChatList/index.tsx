import React, { useCallback, useRef, VFC, forwardRef, MutableRefObject } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, scrollRef) => {
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSize) => prevSize + 1).then(() => {
        const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
        if (current) {
          current.scrollTop(current.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
