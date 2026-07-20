/**
 * LINE Messaging API のグループへ push 通知する。
 * フォーム送信（問い合わせ・見積もりシミュレーション）の内容を、担当者のLINEグループへ届ける。
 * 認証情報は環境変数から読む（リポジトリには置かない）:
 *   LINE_CHANNEL_ACCESS_TOKEN … チャネルアクセストークン（長期）
 *   LINE_GROUP_ID             … 送信先グループID（Cで始まるID）
 * どちらか未設定なら送信せず false を返す（メール側でフォローするため例外にはしない）。
 */
const LINE_PUSH_API = "https://api.line.me/v2/bot/message/push";

export async function sendLineNotification(text: string): Promise<boolean> {
  // 環境変数コピペ時の前後空白・改行混入に耐える（過去にDATABASE_URIで実害あり）
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
  const to = process.env.LINE_GROUP_ID?.trim();
  if (!token || !to) {
    console.log("[line] LINE_CHANNEL_ACCESS_TOKEN / LINE_GROUP_ID 未設定のため送信スキップ");
    return false;
  }
  // LINEのテキストメッセージは1通5000文字まで。念のため切り詰める。
  const body = text.length > 4900 ? text.slice(0, 4900) + "…（省略）" : text;
  try {
    const res = await fetch(LINE_PUSH_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, messages: [{ type: "text", text: body }] }),
    });
    if (!res.ok) {
      console.error("[line] push失敗", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[line] push例外", err);
    return false;
  }
}
