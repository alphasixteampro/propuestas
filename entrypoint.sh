#!/bin/sh
# Genera el archivo .htpasswd desde variables de entorno al iniciar el contenedor
if [ -n "$AUTH_USER" ] && [ -n "$AUTH_PASS" ]; then
  htpasswd -cb /etc/nginx/.htpasswd "$AUTH_USER" "$AUTH_PASS"
else
  echo "ADVERTENCIA: AUTH_USER o AUTH_PASS no definidos — acceso sin contraseña"
fi

exec nginx -g 'daemon off;'
