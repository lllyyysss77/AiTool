const tickerItems = [
  "正在做的产品",
  "今天记了什么",
  "日语学习工具",
  "模型试用记录",
  "App 上架材料",
  "自进化 Agent",
];

export default function AiosTicker() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="aios-marquee">
      <div className="aios-marquee-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}># {item}</span>
        ))}
      </div>
    </div>
  );
}
