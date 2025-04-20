import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const quotes = response.results.map((page) => {
      const quoteProp = page.properties['テキスト'];
      return quoteProp?.rich_text?.[0]?.text?.content || '';
    }).filter(q => q);

    if (quotes.length === 0) {
      return res.status(200).json({ quote: '（名言が登録されていません）' });
    }

    const todayIndex = new Date().getDate() % quotes.length;
    const todayQuote = quotes[todayIndex];

    res.status(200).json({ quote: todayQuote });
  } catch (error) {
    console.error('名言取得失敗:', error);
    res.status(500).json({ error: '名言の取得に失敗しました' });
  }
}
