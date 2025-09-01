import os
import argparse
from pathlib import Path

def generate_cdn_urls(dist_path, base_url):
    """
    生成dist目录下文件的CDN URL列表
    
    Args:
        dist_path (str): dist目录路径
        base_url (str): CDN基础URL
    
    Returns:
        list: 包含所有文件CDN URL的列表
    """
    cdn_urls = []
    dist_path = Path(dist_path)
    
    # 遍历dist目录及其子目录
    for file_path in dist_path.rglob('*'):
        if file_path.is_file():
            # 获取文件相对于dist目录的路径
            rel_path = file_path.relative_to(dist_path)
            # 生成CDN URL
            url = f"{base_url.rstrip('/')}/{str(rel_path).replace(os.sep, '/')}"
            cdn_urls.append(url)
    
    return cdn_urls

def main():
    parser = argparse.ArgumentParser(description='生成dist目录文件的CDN URL列表')
    parser.add_argument('--dist', default='dist', help='dist目录路径 (默认: dist)')
    parser.add_argument('--base-url', required=True, help='CDN基础URL (例如: https://www.fsp.ink)')
    parser.add_argument('--output', help='输出文件路径 (可选)')
    
    args = parser.parse_args()
    
    # 检查dist目录是否存在
    if not os.path.exists(args.dist):
        print(f"错误: 目录 '{args.dist}' 不存在")
        return
    
    # 生成CDN URL列表
    urls = generate_cdn_urls(args.dist, args.base_url)
    
    # 输出结果
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            for url in urls:
                f.write(url + '\n')
        print(f"URL列表已保存到: {args.output}")
        print(f"共生成 {len(urls)} 个URL")
    else:
        for url in urls:
            print(url)

if __name__ == "__main__":
    main()