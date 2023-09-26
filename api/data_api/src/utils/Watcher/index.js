import chokidar from 'chokidar';

const watcher = chokidar.watch('./public/uploads', {
  ignored: /(^|[\/\\])\../,
  persistent: true,
});

export default watcher;
