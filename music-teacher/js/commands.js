// Voice command parser: "<wake word> <command>" in ko/en/zh/ja. Ordered: specific phrases first.
export const WAKE = { ko: ['선생님', '티처'], en: ['teacher'], zh: ['老师', '老師'], ja: ['先生'] };

const C = [
  ['recSave', { ko: ['녹음 저장', '녹음저장'], en: ['save recording'], zh: ['保存录音', '保存錄音'], ja: ['録音保存', '録音を保存'] }],
  ['recStart', { ko: ['녹음 시작', '녹음시작'], en: ['start recording', 'record'], zh: ['开始录音', '開始錄音'], ja: ['録音開始', '録音スタート'] }],
  ['recStop', { ko: ['녹음 종료', '녹음 정지', '녹음 끝'], en: ['stop recording'], zh: ['停止录音', '停止錄音'], ja: ['録音停止', '録音終了'] }],
  ['recPlay', { ko: ['녹음 재생', '녹음 들려'], en: ['play recording'], zh: ['播放录音', '播放錄音'], ja: ['録音再生'] }],
  ['loopStart', { ko: ['구간 시작'], en: ['loop start', 'section start'], zh: ['段落开始', '段落開始'], ja: ['区間開始'] }],
  ['loopEnd', { ko: ['구간 끝'], en: ['loop end', 'section end'], zh: ['段落结束', '段落結束'], ja: ['区間終了'] }],
  ['loopOn', { ko: ['반복 켜', '반복켜'], en: ['loop on', 'repeat on'], zh: ['开启循环', '開啟循環'], ja: ['リピートオン', '反復オン'] }],
  ['loopOff', { ko: ['반복 꺼', '반복꺼'], en: ['loop off', 'repeat off'], zh: ['关闭循环', '關閉循環'], ja: ['リピートオフ', '反復オフ'] }],
  ['metroOn', { ko: ['메트로놈 켜', '메트로놈 시작'], en: ['metronome on', 'start metronome'], zh: ['开启节拍器', '開啟節拍器'], ja: ['メトロノームオン'] }],
  ['metroOff', { ko: ['메트로놈 꺼', '메트로놈 정지'], en: ['metronome off', 'stop metronome'], zh: ['关闭节拍器', '關閉節拍器'], ja: ['メトロノームオフ'] }],
  ['tempo', { ko: ['템포', '비피엠', 'bpm'], en: ['tempo', 'bpm'], zh: ['速度节拍', '节拍', 'bpm'], ja: ['テンポ', 'bpm'] }],
  ['mixPlay', { ko: ['합쳐 듣기', '믹스 재생'], en: ['play mix'], zh: ['播放混音'], ja: ['ミックス再生'] }],
  ['mixExport', { ko: ['믹스 저장', '합친 파일 저장'], en: ['export mix', 'save mix'], zh: ['导出混音', '導出混音'], ja: ['ミックス保存'] }],
  ['analyze', { ko: ['분석', '비교'], en: ['analyze', 'analyse', 'compare'], zh: ['分析', '比较', '比較'], ja: ['分析', '比較'] }],
  ['stopRead', { ko: ['안내 멈춰', '조용히'], en: ['stop reading', 'quiet'], zh: ['停止朗读', '停止朗讀'], ja: ['読み上げ停止'] }],
  ['read', { ko: ['읽어'], en: ['read'], zh: ['朗读', '朗讀'], ja: ['読んで', '読み上げ'] }],
  ['speed', { ko: ['속도'], en: ['speed'], zh: ['速度'], ja: ['速度', 'スピード'] }],
  ['slower', { ko: ['느리게'], en: ['slower'], zh: ['慢一点', '慢一點', '慢'], ja: ['遅く'] }],
  ['faster', { ko: ['빠르게'], en: ['faster'], zh: ['快一点', '快一點', '快'], ja: ['速く'] }],
  ['back', { ko: ['뒤로'], en: ['back', 'rewind'], zh: ['后退', '後退'], ja: ['戻って', '戻る'] }],
  ['forward', { ko: ['앞으로'], en: ['forward', 'skip'], zh: ['前进', '前進'], ja: ['進んで', '進む'] }],
  ['resume', { ko: ['이어하기', '이어서'], en: ['resume'], zh: ['继续练习', '繼續練習'], ja: ['続きから'] }],
  ['guitar', { ko: ['기타'], en: ['guitar'], zh: ['吉他'], ja: ['ギター'] }],
  ['flute', { ko: ['플루트', '플룻'], en: ['flute'], zh: ['长笛', '長笛'], ja: ['フルート'] }],
  ['piano', { ko: ['피아노'], en: ['piano'], zh: ['钢琴', '鋼琴'], ja: ['ピアノ'] }],
  ['pause', { ko: ['정지', '멈춰', '일시정지'], en: ['pause', 'stop'], zh: ['暂停', '暫停', '停止'], ja: ['停止', '止めて', '一時停止'] }],
  ['play', { ko: ['재생', '시작', '틀어'], en: ['play', 'start'], zh: ['播放', '开始', '開始'], ja: ['再生', 'スタート'] }],
];

export function parseCommand(text, lang = 'ko') {
  const s = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const wake = WAKE[lang].find(w => s.includes(w));
  if (!wake) return null;
  const rest = s.slice(s.indexOf(wake) + wake.length).trim();
  const flat = rest.replace(/ /g, '');
  for (const [cmd, pats] of C) {
    if (pats[lang].some(p => rest.includes(p) || flat.includes(p.replace(/ /g, '')))) {
      const num = rest.match(/\d+(?:\.\d+)?/);
      return { cmd, value: num ? parseFloat(num[0]) : undefined };
    }
  }
  return { cmd: 'unknown' };
}
