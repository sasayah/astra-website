import "../lp/lp.css";
import AstoKun from "@/app/components/lp/AstoKun";
import ItemIcon from "@/app/components/lp/ItemIcon";
import { TroubledPerson, Worker } from "@/app/components/lp/LpPeople";
import {
  CompareTriptych,
  FlowFigure,
  HeroSky,
  PainFigure,
  TruckLoadFigure,
} from "@/app/components/lp/LpFigures";

/** 開発用: LPイラストアセットの一覧（noindex・確認後に削除可） */

export const metadata = { robots: { index: false, follow: false } };

const POSES = [
  ["greet", "挨拶"],
  ["point", "指差し"],
  ["phone", "電話"],
  ["ok", "OK"],
] as const;

const DOLLY_ITEMS = ["reizouko", "tansu", "sofa", "jitensha", "desk", "sentakuki", "sodaigomi", "tv", "piano", "bed", "kagu", "aircon"] as const;
const HUG_ITEMS = ["monitor", "futon", "mattress", "kaden"] as const;
const ALL_ITEMS = [
  "reizouko", "sentakuki", "tv", "aircon", "mattress", "bed", "tansu", "sofa",
  "desk", "piano", "jitensha", "futon", "monitor", "kagu", "kaden", "sodaigomi",
] as const;

const card: React.CSSProperties = {
  background: "#FFF6E0",
  border: "1px solid #F0DCAE",
  borderRadius: 12,
  padding: "10px 8px 6px",
  textAlign: "center",
  margin: 0,
};
const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-start" };

export default function LpPreview() {
  return (
    <main style={{ padding: 24, background: "#fdfbf5", fontFamily: "sans-serif", color: "#22334D" }}>
      <h1>アストくん ギャラリー（dev）</h1>

      <h2>立ちポーズ</h2>
      <section id="poses" style={row}>
        {POSES.map(([pose, label]) => (
          <figure key={pose} style={{ ...card, width: 120 }}>
            <AstoKun pose={pose} />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </section>

      <h2>台車（品目スロット）</h2>
      <section id="dolly" style={row}>
        {DOLLY_ITEMS.map((slug) => (
          <figure key={slug} style={{ ...card, width: 186 }}>
            <AstoKun pose="dolly" item={slug} />
            <figcaption>{slug}</figcaption>
          </figure>
        ))}
      </section>

      <h2>抱える（品目スロット）</h2>
      <section id="hug" style={row}>
        {HUG_ITEMS.map((slug) => (
          <figure key={slug} style={{ ...card, width: 120 }}>
            <AstoKun pose="hug" item={slug} />
            <figcaption>{slug}</figcaption>
          </figure>
        ))}
      </section>

      <h2>人物イラスト（困っている人・作業員）</h2>
      <section id="people" style={row}>
        {(["shufu", "senior", "tanshin"] as const).map((k) => (
          <figure key={k} style={{ ...card, width: 110 }}>
            <TroubledPerson kind={k} mood="worry" />
            <figcaption>{k}／困り</figcaption>
          </figure>
        ))}
        <figure style={{ ...card, width: 110 }}>
          <TroubledPerson kind="shufu" mood="happy" />
          <figcaption>shufu／笑顔</figcaption>
        </figure>
        {(["bow", "carry", "estimate", "phone"] as const).map((p) => (
          <figure key={p} style={{ ...card, width: 110 }}>
            <Worker pose={p} item={p === "carry" ? "sofa" : undefined} />
            <figcaption>作業員／{p}</figcaption>
          </figure>
        ))}
        <figure style={{ ...card, width: 110 }}>
          <Worker female pose="bow" />
          <figcaption>女性スタッフ</figcaption>
        </figure>
      </section>

      <h2>図解</h2>
      <section id="figs" style={{ ...row, flexDirection: "column" }}>
        <figure style={{ ...card, width: 360 }}>
          <div style={{ height: 100, position: "relative", overflow: "hidden", borderRadius: 8 }}>
            <HeroSky />
          </div>
          <figcaption>ヒーロー背景（朝焼け＋大阪の街）</figcaption>
        </figure>
        <figure style={{ ...card, width: 300 }}>
          <PainFigure itemSlug="reizouko" />
          <figcaption>お悩み図（品目スロット）</figcaption>
        </figure>
        <div style={row}>
          {([1, 2, 3] as const).map((s) => (
            <figure key={s} style={{ ...card, width: 150 }}>
              <FlowFigure step={s} />
              <figcaption>流れ STEP {s}</figcaption>
            </figure>
          ))}
        </div>
        <div style={row}>
          {(["quarter", "half", "full"] as const).map((l) => (
            <figure key={l} style={{ ...card, width: 150 }}>
              <TruckLoadFigure level={l} />
              <figcaption>積載量 {l}</figcaption>
            </figure>
          ))}
        </div>
        <div className="lp" style={{ width: "100%", maxWidth: 720 }}>
          <CompareTriptych speed="最短20分" />
        </div>
      </section>

      <h2>品目アイコン16種</h2>
      <section id="icons" style={row}>
        {ALL_ITEMS.map((slug) => (
          <figure key={slug} style={{ ...card, width: 86, background: "#fff" }}>
            <ItemIcon slug={slug} />
            <figcaption style={{ fontSize: 11 }}>{slug}</figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
