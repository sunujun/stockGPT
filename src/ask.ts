import type { Message } from './App';

const parseLine = (str: string) => {
  // 정규 표현식을 사용하여 주어진 문자열을 파싱
  const match = /^(.*?):\s?(.*)$/.exec(str);
  // 정규 표현식에 맞지 않는 경우, [null, str] 배열을 반환
  if (!match) {
    return [null, str];
  }

  // 정규 표현식에 맞는 경우, [field, value] 형태로 추출하고 null 값 처리
  return [match[1], match[2]].map((i) => i ?? null);
};

type ParseResult =
  | {
      type: 'event';
      event: string | null;
      id: string | null;
      data: string | null;
    }
  | {
      type: 'retry';
      value: number;
    };

const createParseChunkFn = (onParse: (val: ParseResult) => void) => {
  let buffer = '';

  const parseBuffer = () => {
    let eventName: string | null = null;
    let eventId: string | null = null;

    for (const line of buffer.split('\n')) {
      if (!line || line.startsWith(':')) {
        // Ignore invalid data
      } else {
        const [field, value] = parseLine(line);

        switch (field) {
          case 'event':
            eventName = value;
            break;

          case 'id':
            eventId = value;
            break;

          case 'data':
            onParse({
              type: 'event',
              event: eventName,
              id: eventId,
              data: value,
            });
            break;

          case 'retry':
            const retry = Number(value);
            if (!Number.isNaN(retry)) {
              onParse({ type: 'retry', value: retry });
            }
            break;

          default:
            break;
        }
      }
    }
  };

  return (chunk: string) => {
    buffer += chunk;

    if (buffer.endsWith('\n\n')) {
      parseBuffer();
      buffer = '';
    }
  };
};

const ask = async (
  onMessage: (data: string | null) => void,
  messages: Message[]
) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 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', // Fill your OpenAI key
    },
    body: JSON.stringify({
      stream: true,
      max_tokens: 1000,
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 1,
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error('Fetch sse error');
  }

  const parseChunk = createParseChunkFn((event) => {
    if (event.type === 'event') {
      onMessage(event.data);
    }
  });

  const reader = res.body?.getReader();
  if (reader) {
    void (function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          return;
        }
        const chunk = new TextDecoder().decode(value);
        parseChunk(chunk);
        read();
      });
    })();
  }
};

export default ask;
