#le "b" permet d'envoyer les octets bruts et pas les chaines de char

REQUETES_PORTS = {
    80: b"GET / HTTP/1.0\r\n\r\n",
    443: b"GET / HTTP/1.0\r\n\r\n",
    554: b"OPTIONS * RTSP/1.0\r\nCSeq: 1\r\n\r\n",
    631: b"GET / HTTP/1.0\r\n\r\n",
}