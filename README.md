# FSP-exam-Vue

[后端地址](https://github.com/tangsu99/fsp-exam-flask)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Plugin

1. editorconfig
2. prettier

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### nginx 配置文件

```nginx

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen      443 ssl http2;      #IPV4
        listen      [::]:443 ssl http2; #IPv6
        server_name exam.fsp.ink;

        location / {
            root    /usr/share/web/exam;
            index   index.html;
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(jpg|jpeg|png|gif|webp|ico|svg|ttf|otf|woff|woff2|eot)$ {
            root    /usr/share/web/exam;
            expires 7d;
            add_header Cache-Control "public, max-age=604800";
            add_header ETag "";
            access_log off;
        }

        error_page 404 /404.html;
            location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }


        ssl_certificate     /etc/nginx/ssl/exam.fsp.ink.pem;
        ssl_certificate_key /etc/nginx/ssl/exam.fsp.ink.key;

        # 传输时默认开启gzip压缩
        gzip on;

        # 传输时会被压缩的类型(应当依据文件压缩效果添加)
        gzip_types text/plain text/css application/javascript application/xml application/json;

        # 反向代理时，启用压缩
        gzip_proxied any;

        # 传输时压缩等级，等级越高压缩消耗CPU越多，最高9级，通常5级就够了
        gzip_comp_level 5;

        # 传输时大小达到1k才压缩，压缩小内容无意义
        gzip_min_length 1k;

        # 支持协议、算法与超时时间等 一般无需更改
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
    }

    server {
        listen      443 ssl http2;      #IPV4
        listen      [::]:443 ssl http2; #IPv6
        server_name api.fsp.ink;

        location / {
            proxy_pass          http://127.0.0.1:5000/;
            proxy_set_header    Host $host;
            proxy_set_header    X-Real-Ip $remote_addr;
            proxy_set_header    X-Forwarded-For $remote_addr;
            proxy_set_header    REMOTE-HOST $remote_addr;
        }

        error_page 404 /404.html;
            location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }

        ssl_certificate     /etc/nginx/ssl/api.fsp.ink.pem;
        ssl_certificate_key /etc/nginx/ssl/api.fsp.ink.key;

        # 传输时默认开启gzip压缩
        gzip on;

        # 传输时会被压缩的类型(应当依据文件压缩效果添加)
        gzip_types text/plain text/css application/javascript application/xml application/json;

        # 反向代理时，启用压缩
        gzip_proxied any;

        # 传输时压缩等级，等级越高压缩消耗CPU越多，最高9级，通常5级就够了
        gzip_comp_level 5;

        # 传输时大小达到1k才压缩，压缩小内容无意义
        gzip_min_length 1k;

        # 支持协议、算法与超时时间等 一般无需更改
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
    }
}

```

### 引用

- 主页 logo 来自：<https://github.com/EaseCation/cube-3d-text>
- 使用的贴图：
  - minecraft 原版材质包
  - 彩虹像素材质包
