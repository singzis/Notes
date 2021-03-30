const videoUrlHandle = url => {
  const videoSuffix = [
    'mp4',
    'avi',
    'mpeg',
    'mpeg1',
    'mpeg2',
    'mpeg3',
    'mpeg4',
    'wmv',
    'rm',
    'rmvb',
    'asf',
    'asx',
    '3gp',
    'mov',
    'm4v',
    'dat',
    'mkv',
    'flv',
    'vob',
  ]
  const suffix = url
    .split('.')
    .pop()
    .toLowerCase()
  return videoSuffix.some(v => v === suffix)
}