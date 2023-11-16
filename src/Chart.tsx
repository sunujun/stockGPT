// TradingViewWidget.jsx

import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function Chart({
  stockNumber,
  id,
}: {
  stockNumber: string;
  id: string;
}) {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;
    const symbol = "KRX:" + stockNumber;
    console.log(symbol);

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      const element = document.getElementById("tradingview"); // 해당 요소를 가져옴
      if (element) {
        element.id = "tradingview_" + stockNumber + "_" + id; // 가져온 요소의 id 속성을 동적으로 변경
      }
      if (
        document.getElementById("tradingview_" + stockNumber + "_" + id) &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Asia/Seoul",
          theme: "light",
          style: "1",
          locale: "kr",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_" + stockNumber + "_" + id,
        });
      }
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%" }}
    >
      <div
        id="tradingview"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
    </div>
  );
}
