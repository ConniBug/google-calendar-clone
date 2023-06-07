export default {
  0: { shortcut: '0', action: "change app theme" },
  1: { shortcut: ['1', 'D'], action: 'open day view' },
  2: { shortcut: ['2', 'W'], action: 'open week view' },
  3: { shortcut: ['3', 'M'], action: 'open month view' },
  4: { shortcut: ['4', 'Y'], action: 'open year view' },
  5: { shortcut: ['5', 'L'], action: 'open list view' },
  6: { shortcut: 'v', action: 'toggle view options' },
  7: { shortcut: 't', action: 'set date to today' },
  8: { shortcut: "g", action: 'enter date manually' },
  9: { shortcut: "n", action: 'next period' },
  10: { shortcut: "p", action: 'previous period' },
  11: { shortcut: 's', action: 'toggle sidebar' },
  12: { shortcut: 'f', action: 'open form' },
  13: { shortcut: '+', action: 'open new category form' },
  14: { shortcut: 'a', action: 'open settings' },
  15: { shortcut: ['/', '?'], action: 'open keyboard shortcuts' },
  16: { shortcut: "e", action: '(entry options) opens form with entry details' },
  17: {
    shortcut: '↑', action: [
      '(datepicker) set date to next month/week',
      '(yearpicker) set year to next year'
    ]
  },
  18: {
    shortcut: '↓', action: [
      '(datepicker) set date to prev month/week',
      '(yearpicker) set year to prev year'
    ]
  },
  19: {
    shortcut: '←', action: [
      '(datepicker) set date to prev day',
      '(monthpicker) set month to prev month',
    ]
  },
  20: {
    shortcut: '→', action: [
      '(datepicker) set date to next day',
      '(monthpicker) set month to next month',
    ]
  },
  21: { shortcut: 'DELETE', action: '(entry options) delete entry' },
  22: {
    shortcut: 'ENTER', action: [
      '(datepicker) set date to selected date',
      '(form) submit form',
    ]
  },
  23: { shortcut: "ESCAPE", action: 'close any active modal/popup/form' },
};

// export default {
//   0: { shortcut: '0', action: "アプリのテーマを変更する" },
//   1: { shortcut: ['1', 'D'], action: '日表示を開く' },
//   2: { shortcut: ['2', 'W'], action: '週表示を開く' },
//   3: { shortcut: ['3', 'M'], action: '月表示を開く' },
//   4: { shortcut: ['4', 'Y'], action: '年表示を開く' },
//   5: { shortcut: ['5', 'L'], action: 'リスト表示を開く' },
//   6: { shortcut: 'v', action: '表示オプションを切り替える' },
//   7: { shortcut: 't', action: '日付を今日に設定する' },
//   8: { shortcut: "g", action: '日付を手動で入力する' },
//   9: { shortcut: "n", action: '次の期間へ移動する' },
//   10: { shortcut: "p", action: '前の期間へ移動する' },
//   11: { shortcut: 's', action: 'サイドバーを切り替える' },
//   12: { shortcut: 'f', action: 'フォームを開く' },
//   13: { shortcut: '+', action: '新しいカテゴリフォームを開く' },
//   14: { shortcut: 'a', action: '設定を開く' },
//   15: { shortcut: ['/', '?'], action: 'キーボードショートカットを開く' },
//   16: { shortcut: "e", action: '(エントリオプション) エントリの詳細を含むフォームを開く' },
//   17: {
//     shortcut: '↑', action: [
//       '(日付ピッカー) 次の月/週の日付を設定する',
//       '(年ピッカー) 次の年を設定する'
//     ]
//   },
//   18: {
//     shortcut: '↓', action: [
//       '(日付ピッカー) 前の月/週の日付を設定する',
//       '(年ピッカー) 前の年を設定する'
//     ]
//   },
//   19: {
//     shortcut: '←', action: [
//       '(日付ピッカー) 前の日に設定する',
//       '(月ピッカー) 前の月を設定する',
//     ]
//   },
//   20: {
//     shortcut: '→', action: [
//       '(日付ピッカー) 次の日に設定する',
//       '(月ピッカー) 次の月を設定する',
//     ]
//   },
//   21: { shortcut: 'DELETE', action: '(エントリオプション) エントリを削除する' },
//   22: {
//     shortcut: 'ENTER', action: [
//       '(日付ピッカー) 選択した日付を設定する',
//       '(フォーム) フォームを送信する',
//     ]
//   },
//   23: { shortcut: "ESCAPE", action: 'アクティブなモーダル/ポップアップ/フォームを閉じる' },
// };