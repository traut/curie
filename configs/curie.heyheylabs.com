
upstream curieapp {
    server 127.0.0.1:8080;
}


server {
        listen   80; ## listen for ipv4
        #listen [::]:80 default ipv6only=on;

        server_name  curie.heyheylabs.com;

        location / {
            rewrite     ^   https://$server_name$request_uri? permanent;
        }

}

server {
        listen   443 ssl;
        #listen   [::]:443 ipv6only=on ssl;
        ssl_certificate /etc/ssl/certs/curie.heyheylabs.com.pem;
        ssl_certificate_key /etc/ssl/private/curie.heyheylabs.com.key;

        server_name  curie.heyheylabs.com;
        root /var/www/curie.heyheylabs.com/web;


        location /static/ {
            autoindex on;
            root /home/curie/curie/front;
        }

        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_pass http://curieapp/;
            proxy_redirect off;
            proxy_http_version 1.1;
            proxy_read_timeout 1200;
        }

        access_log /home/curie/access.log;
        error_log /home/curie/error.log;

}
