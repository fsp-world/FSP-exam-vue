type FileHandler = (content: string) => void;

/**
 * 检查文件名是否包含常见的文件系统非法格式
 */
export const isValidFileName = (fileName: string): boolean => {
  const name = fileName.trim();
  const containsControlCharacter = [...name].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  });

  if (!name || containsControlCharacter || /[\\/:*?"<>|]/.test(name) || /[ .]$/.test(name)) {
    return false;
  }

  const baseName = name.split('.').at(0)?.toLowerCase();
  return !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(baseName ?? '');
};

/**
 * 选择并读取单个文件
 * @param accept 文件类型（如 '.json'）
 * @param handler 处理文件内容的回调函数
 */
export const selectSingleFile = (accept: string, handler: FileHandler): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      console.warn('未选择文件');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      handler(content);
    };

    reader.onerror = () => {
      console.error('文件读取失败');
      alert('文件读取失败');
    };

    reader.readAsText(file);
  };

  input.click();
};
