# WashAI updater sidecar — pulls from Git and rebuilds the app container when
# the owner presses "Update" on the /system page.
FROM docker:27-cli
RUN apk add --no-cache git nodejs
COPY server.js /updater/server.js
CMD ["node", "/updater/server.js"]
