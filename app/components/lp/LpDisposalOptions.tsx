import type { LpItem } from "@/app/lib/lp-data";
import { extraOf } from "@/app/lib/lp-data";

/**
 * 品目別「処分方法の選び方」比較表（A/B両LPで共用）。
 * 品目ごとに固有の制度・手間・注意点を並べ、最後の行（アストラ）をハイライトする。
 */
export default function LpDisposalOptions({ item }: { item: LpItem }) {
  const extra = extraOf(item.slug);
  if (!extra) return null;
  return (
    <>
      <p className="lp-options__intro">{extra.intro}</p>
      <div className="lp-table-wrap">
        <table className="lp-options">
          <thead>
            <tr>
              <th>処分方法</th>
              <th>費用感</th>
              <th>手間</th>
              <th>ポイント</th>
            </tr>
          </thead>
          <tbody>
            {extra.options.map((o, i) => (
              <tr key={o.way} className={i === extra.options.length - 1 ? "is-astra" : ""}>
                <th>{o.way}</th>
                <td className="lp-options__cost">{o.cost}</td>
                <td className="lp-options__effort">{o.effort}</td>
                <td>{o.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
