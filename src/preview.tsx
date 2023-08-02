import { useEffect } from 'react';
import { UrlRegExp } from './constants';
interface PreviewProps {
  url: string;
  onLoad: () => void;
}


enum Suite {
  sheet = 'sheets',
  doc = 'docs',
  docx = 'docx',
  bitable = 'base',
  note = 'mindnotes',
  wiki = 'wiki',
}

const suiteDomains = ['feishu.cn', 'feishu.net', 'feishu-boe.cn', 'feishu-boe.net', 'larksuite.com'];

const getHeaderQuery = (url: string) => {
  const res = UrlRegExp.exec(url);
  if (!res) {
    return null;
  }
  const domain = res[1]?.split('//')?.[1];
  // 判断是否是云文档，如果是的话，需要隐藏头部和侧边栏
  const isSuiteDomain = suiteDomains.some(suiteDomain => domain.endsWith(suiteDomain));
  if (isSuiteDomain) {
    const path = res[res.length - 1]?.split('/');
    const suiteName = path?.[1];
    const pathEnd = path ? path[path.length - 1] : '';
    const query = pathEnd?.split('?')[1];
    let hideHeader = 'lark=1&hideHeader=1';
    if (query) {
      hideHeader = '&' + hideHeader;
    } else {
      hideHeader = '?' + hideHeader;
    }
    if (suiteName === Suite.bitable) {
      return hideHeader + '&hideSidebar=1';
    } else if (suiteName === Suite.wiki) {
      return hideHeader + '&hideSider=1';
    } else if (
      [Suite.sheet, Suite.doc, Suite.docx, Suite.note].includes(suiteName as Suite)
    ) {
      return hideHeader;
    }
  }
  return '';
};

export const Preview = (props: PreviewProps) => {
  const { url, onLoad } = props;

  useEffect(() => {
    setTimeout(() => {
      // 超过1.5s停止loading，使用页面自带的loading
      onLoad();
    }, 1500)
  }, [])

  const query = getHeaderQuery(url);

  // if (query === null) {
  //   loadCallback();
  //   return null;
  // }

  return (
    <div>
      <iframe
        src={`${url}${query || ''}`}
        className='iframe-preview'
        onLoad={onLoad}
      ></iframe>
    </div>
  );
}