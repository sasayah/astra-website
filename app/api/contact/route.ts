import { NextResponse } from "next/server";

const RESEND_API = "https://api.resend.com/emails";

/** ラベルとして分かりやすい日本語名に寄せる（旧フォームの独自name対策） */
const FIELD_LABELS: Record<string, string> = {
  "parm[name]": "お名前",
  "parm[input_main_tp]": "電話番号",
  "parm[radio]": "ご希望",
  "parm[address]": "住所",
  name: "お名前",
  last_name: "姓",
  first_name: "名",
  phone_number: "電話番号",
  email_address: "メールアドレス",
  postal_code: "郵便番号",
  service_id: "サービス内容",
  quantity_id: "回収量",
  quantity_other: "回収量(その他)",
  building_type: "建物の種類",
  elevator: "エレベーター",
  customer_type: "お客様区分",
  company_name: "法人名",
  address: "住所・エリア",
  message: "ご相談内容",
  lp: "送信元LP",
};

const IGNORE_KEYS = new Set([
  "action",
  "__send__",
  "__retry_input__",
  "custom_form_submitted",
  "custom_form_nonce_field",
  "_wp_http_referer",
  "recaptcha_response",
]);

function formatBody(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([k, v]) => !IGNORE_KEYS.has(k) && v?.trim())
    .map(([k, v]) => `${FIELD_LABELS[k] ?? k}: ${v}`)
    .join("\n");
}

async function sendEmail(to: string, subject: string, text: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "アストラ <info@pe-astra.com>";
  if (!key) {
    // 開発時など未設定でも動くよう、送信内容をログに出して成功扱いにする
    console.log(`[contact] (RESEND_API_KEY未設定) to=${to} subject=${subject}\n${text}`);
    return true;
  }
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, reply_to: replyTo }),
  });
  if (!res.ok) {
    console.error("[contact] Resend送信失敗", res.status, await res.text());
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  let fields: Record<string, string> = {};
  const ctype = req.headers.get("content-type") || "";
  try {
    if (ctype.includes("application/json")) {
      fields = await req.json();
    } else {
      const fd = await req.formData();
      for (const [k, v] of fd.entries()) fields[k] = String(v);
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  // 必須: 電話番号（mailForm= parm[input_main_tp] / simple_form= phone_number）。
  // 空フォーム送信・botによる空メール送信を防ぐ最低限のサーバー側検証。
  const phone = (fields["parm[input_main_tp]"] || fields["phone_number"] || "").trim();
  if (!phone) {
    return NextResponse.json({ ok: false, error: "phone required" }, { status: 400 });
  }

  const adminTo = process.env.MAIL_TO || "info@pe-astra.com";
  const body = formatBody(fields);
  const submitterEmail = fields["email_address"] || fields["parm[email]"] || "";

  const okAdmin = await sendEmail(
    adminTo,
    "ホームページからお問い合わせがありました",
    body,
    submitterEmail || undefined,
  );

  // 送信者への自動返信（メールアドレスがある場合のみ）
  if (submitterEmail) {
    const auto = `お問い合わせいただき誠にありがとうございます。\n\n下記の内容を確認させていただいた後、折り返し担当よりご連絡いたします。\n\n----------------------------------------\n${body}\n----------------------------------------\n\nお急ぎの場合は 0120-709-333 までご連絡ください。\n\nリサイクル・不用品回収アストラ`;
    await sendEmail(submitterEmail, "お問い合わせいただきありがとうございます", auto);
  }

  return NextResponse.json({ ok: okAdmin });
}
