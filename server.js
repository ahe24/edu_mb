const express = require('express');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 8900;

app.prepare().then(() => {
  const server = express();

  // 이곳에 향후 강의 폴더별(예: /mb/lec01) 정적 서빙 라우트를 추가할 수 있습니다.
  // server.use('/mb/lec01', express.static(path.join(__dirname, 'lectures/lec01')));

  // 기본 라우팅은 Next.js 핸들러가 처리합니다.
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
