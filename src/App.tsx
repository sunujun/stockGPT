import React, { useCallback, useState } from "react";
import { Button, Input, Space, Typography } from "antd";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useGetGptResponse } from "./hooks";
import "./App.css";
import ask from "./ask";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/vs2015.css";
import Chart from "./Chart";

const { Text } = Typography;

const enum Role {
  Assistant = "assistant",
  User = "user",
}

export interface Message {
  role: Role;
  content: string;
}

interface Log extends Message {
  id: string;
  answering?: boolean;
}

const queryClient = new QueryClient();

const App = () => {
  const [question, setQuestion] = useState("");
  const [logs, setLogs] = useState<Log[]>(() => []);
  const [result, setResult] = useState({});
  // const { mutate: getGptResponse, isSuccess: getGptResponseSuccess } = useGetGptResponse();
  const [answeringContent, setAnsweringContent] = useState("");
  // console.log(import.meta.env.VITE_API_URL)
  // const {isLoading, error, data} = useQuery({
  //   queryKey: ['messages'],
  //   queryFn: () =>
  //     fetch(`${import.meta.env.BASE_URL}/getGptResponse/삼성전자 재무제표`).then(res => res.json()),
  // });

  const initialData = [
    { time: 1672371900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672375500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672379100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672382700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672386300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672389900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672393500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672397100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672400700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672404300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672407900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672411500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672415100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672418700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672422300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672425900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672429500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672433100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672436700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672440300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672443900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672447500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672451100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672454700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672458300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672461900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672465500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672469100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672472700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672476300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672479900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672483500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672487100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672490700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672494300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672497900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672501500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672505100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672508700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672512300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672515900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672519500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672523100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672526700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672530300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672533900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672537500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672541100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672544700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672548300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672551900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672555500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672559100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672562700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672566300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672569900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672573500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672577100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672580700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672584300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672587900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672591500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672595100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672598700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672602300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672605900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672609500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672613100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672616700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672620300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672623900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672627500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672631100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672634700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672638300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672641900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672645500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672649100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672652700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672656300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672659900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672663500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672667100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672670700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672674300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672677900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672681500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672685100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672688700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672692300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672695900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672699500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672703100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672706700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672710300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672713900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672717500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672721100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672724700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672728300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672731900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672735500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672739100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672742700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672746300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672749900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672753500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672757100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672760700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672764300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
    { time: 1672767900, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: 1672771500, open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: 1672775100, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: 1672778700, open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: 1672782300, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: 1672785900, open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: 1672789500,
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    { time: 1672793100, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
    { time: 1672796700, open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    { time: 1672800300, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
  ];

  const getGptResponse = async (userInput: string) => {
    // const fetchedResponse = await fetch(`${import.meta.env.VITE_API_URL}/getGptResponse/삼성전자 재무제표`);

    const fetchedResponse = await fetch(
      `https://port-0-stockgptbackend-2rrqq2bln09iu11.sel5.cloudtype.app/getGptResponse/${userInput}`
    );
    if (!fetchedResponse.ok) {
      // throw new Error('네트워크 응답이 올바르지 않습니다.');
      return "error";
    }
    // console.log(fetchedResponse.json());

    return fetchedResponse.json();
  };

  // // Queries
  // const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // // Mutations
  // const mutation = useMutation({
  //   mutationFn: postTodo,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ['todos'] })
  //   },
  // })

  const askQuestion = useCallback((messages: Message[]) => {
    // setAnsweringContent('&ZeroWidthSpace;');
    // console.log(messages[messages.length - 1].content)
    getGptResponse(messages[messages.length - 1].content).then((res) => {
      console.log(res);
      const result =
        res === "error" || res.error === "No data" || res.length === 0
          ? "error"
          : res[0];
      const contents =
        result !== "error"
          ? result.hasOwnProperty("stck_shrn_iscd")
            ? `${result.stck_shrn_iscd}`
            : `${result.itmsNm}의 부채총계는 ${result.부채총계}원, 비유동부채는 ${result.비유동부채}원, 비유동자산은 ${result.비유동자산}원, 유동부채는 ${result.유동부채}원, 
      유동자산 ${result.유동자산}원, 이익잉여금은 ${result.이익잉여금}원, 자본금은 ${result.자본금}원, 자산총계는 ${result.자산총계}원입니다.`
          : "잘못된 입력입니다.";
      // setAnsweringContent(`삼성전자의 부채총계는 ${result.부채총계}`);
      setTimeout(() => {
        setAnsweringContent("");
        setLogs((prev) =>
          prev.map((i) => {
            const { answering, ...rest } = i;
            if (answering) {
              return {
                ...rest,
                content: contents,
              };
            }
            return i;
          })
        );
      }, 60);
    });

    // let contents = '';
    // ask((str) => {
    //   if (!str) return;
    //   if (str === '[DONE]') {
    //     setAnsweringContent('');
    //     setLogs((prev) =>
    //       prev.map((i) => {
    //         const { answering, ...rest } = i;
    //         if (answering) {
    //           return {
    //             ...rest,
    //             content: contents,
    //           };
    //         }
    //         return i;
    //       })
    //     );

    //     return;
    //   }

    //   let content = str;
    //   try {
    //     const data = JSON.parse(str);
    //     content = data.choices?.reduce((acc: string, cur: unknown) => {
    //       // @ts-expect-error
    //       acc += cur?.delta?.content ?? '';
    //       return acc;
    //     }, '');
    //   } catch {
    //     // Ignore
    //     // console.error(err);
    //   }

    //   contents += content;
    //   setAnsweringContent(contents);
    // }, messages);
  }, []);

  const isAnswering = Boolean(answeringContent);

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAnswering || !question) return;
    if (e.nativeEvent.isComposing) return;

    const messages = logs.concat({
      id: crypto.randomUUID(),
      role: Role.User,
      content: question,
    });

    askQuestion(messages.map((i) => ({ role: i.role, content: i.content })));
    setQuestion("");
    setLogs([
      ...messages,
      {
        content: "",
        answering: true,
        role: Role.Assistant,
        id: crypto.randomUUID(),
      },
    ]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className="main">
        {/* <Chart /> */}
        <div className="chat">
          <div className="logs">
            {logs.map((l, index) => (
              <div key={l.id} className="log">
                <Text strong>
                  {l.role === Role.User ? "User:" : "StockGPT:"}
                </Text>
                <div className={l.answering ? "streaming" : ""}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {l.answering
                      ? answeringContent
                      : !isNaN(parseInt(l.content, 10))
                      ? ""
                      : l.content}
                  </ReactMarkdown>
                </div>
                {l.role === Role.Assistant &&
                  !isNaN(parseInt(l.content, 10)) && (
                    <Chart stockNumber={l.content} id={index.toString()} />
                  )}
              </div>
            ))}
          </div>
          <Space.Compact>
            <Input
              allowClear
              value={question}
              onPressEnter={onSubmit}
              placeholder="Enter your question"
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button type="primary" onClick={onSubmit} loading={isAnswering}>
              {isAnswering ? "Answering" : "Submit"}
            </Button>
          </Space.Compact>
        </div>
      </main>
    </QueryClientProvider>
  );
};

export default App;
