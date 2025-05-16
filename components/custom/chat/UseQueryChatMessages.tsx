import { CHAT_MESSAGE_MAX, chatChannelMessageList } from "@/api/chat";
import { UID } from "@/api/types";
import { ChatMessage } from "@/api/typex2";
import Sleep from "@/utils/sleep";
import { useEffect, useMemo, useState } from "react";

interface MessagesByPage {
  page: number;
  messages: ChatMessage[];
}

export default function useQueryChatMessages(
  chainUID: UID | undefined,
  chatChannelID: number | null,
) {
  const [page, setPage] = useState(() => ({
    oldest: 0,
    newest: 0,
    seed: new Date().valueOf(),
  }));

  const [history, setHistory] = useState<MessagesByPage[]>([]);

  useEffect(() => {
    if (!chainUID || !chatChannelID) {
      setHistory([]);
      return;
    }

    console.info("change", chatChannelID);
    resetToNow();
  }, [chainUID, chatChannelID]);

  const messages = useMemo(
    () =>
      history.reduce((prev, curr) => {
        prev.push(...curr.messages.map((m) => ({ page: curr.page, ...m })));
        return prev;
      }, [] as ChatMessage[]),
    [history],
  );

  // returns NaN if it couldn't find the message
  function findPageOfMessageID(messageID: number): number {
    for (const msgByPage of history) {
      const found = !!msgByPage.messages.find((m) => m.id === messageID);
      if (found) return msgByPage.page;
    }

    return NaN;
  }

  async function resetToNow() {
    // console.log("resetToNow");
    const seed = new Date().valueOf();
    const messages = await chatChannelMessageList({
      chain_uid: chainUID!,
      chat_channel_id: chatChannelID!,
      start_from: seed,
      page: 0,
    }).then((res) => res.data.messages);
    setPage({ oldest: 0, newest: 0, seed });
    setHistory([
      {
        page: 0,
        messages,
      },
    ]);
  }

  async function addPagePrev() {
    // console.log("addPagePrev");
    const prevOldestMessagesLength =
      history.find((mp) => mp.page == page.oldest)?.messages.length || 0;
    if (prevOldestMessagesLength < CHAT_MESSAGE_MAX) {
      console.info("end of channel reached", page.oldest);
      return;
    }
    const oldest = page.oldest + 1;
    const messages = await chatChannelMessageList({
      chain_uid: chainUID!,
      chat_channel_id: chatChannelID!,
      start_from: page.seed,
      page: oldest,
    }).then((res) => res.data.messages);
    setHistory((s) => [
      ...s,
      {
        page: oldest,
        messages,
      },
    ]);
    setPage((s) => ({ ...s, oldest }));
  }

  async function addPagesTillNewest() {
    // console.log("addPagesTillNewest");
    let newest = page.newest;
    let isLatestPage = await addPageCurrOrNext(newest);
    while (!isLatestPage) {
      await Sleep(500);
      newest--;
      isLatestPage = await addPageCurrOrNext(newest);
    }
  }
  // returns if reached latest message
  async function addPageCurrOrNext(newest: number): Promise<boolean> {
    // console.log("addPageCurrOrNext");
    const messages = await chatChannelMessageList({
      chain_uid: chainUID!,
      chat_channel_id: chatChannelID!,
      start_from: page.seed,
      page: newest,
    }).then((res) => res.data.messages);
    setHistory((s) => [
      {
        page: newest,
        messages,
      },
      ...s.filter((mp) => mp.page !== newest),
    ]);
    setPage((s) => ({ ...s, newest }));
    return messages.length === 0;
  }

  async function afterMessageAltered(messageID: number) {
    // console.log("afterMessageAltered");
    const oldest = findPageOfMessageID(messageID);
    if (Number.isNaN(oldest)) return resetToNow();
    // console.log("afterMessageAltered", "page", oldest, "messageID", messageID);

    const messages = await chatChannelMessageList({
      chain_uid: chainUID!,
      chat_channel_id: chatChannelID!,
      start_from: page.seed,
      page: oldest,
    }).then((res) => res.data.messages);
    setHistory((s) => [
      ...s.filter((mp) => mp.page < oldest),
      {
        page: oldest,
        messages,
      },
    ]);
    setPage((s) => ({ ...s, oldest }));
  }

  return {
    messages,
    resetToNow,
    afterMessageAltered,
    addPagePrev,
    addPagesTillNewest,
  };
}
