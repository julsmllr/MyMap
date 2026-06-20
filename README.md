# MyMap — Scanner réseau maison


Le but ici était de comprendre comment marche en réalité l'outil `nmap`. Comment ça marche ? Pourquoi ça marche ? 
Alors, je l'ai recréé.
Il découvre les hôtes actifs sur le réseau local, scanne leurs ports ouverts et tente d'identifier les services qui tournent dessus.

---

## Ce que j'ai fait

**1. Découverte des hôtes (ARP scan)**  
Envoie une requête ARP en broadcast vers chaque IP du sous-réseau. Les machines qui répondent sont actives. On récupère leur IP et leur adresse MAC.

**2. Scan des ports (SYN scan)**  
Pour chaque hôte découvert, envoie un paquet TCP SYN sur les ports 1 à 1024. Si la machine répond SYN-ACK, le port est ouvert. Si elle répond RST, il est fermé. Sans réponse, il est filtré (pare-feu).

**3. Banner grabbing**  
Se connecte à chaque port ouvert et lit ce que le service envoie. Pour les protocoles qui n'envoient rien spontanément (HTTP, HTTPS, RTSP, ...), envoie une requête adaptée avant d'écouter. Extrait le header `Server:` pour identifier le logiciel et sa version.

---

## Exemple de sortie

```
Scan des ips en cours (10sec...)
----------------------------- SCAN DES MACs -----------------------------
IP                   MAC
----------------------------------------
192.168.1.134 - 28:d0:43:8d:61:3c
192.168.1.254 - 20:66:cf:5b:7e:91
192.168.1.169 - f8:25:51:1d:a6:e0

----------------------------- SCAN DES PORTS -----------------------------
IP : 192.168.1.254
        PORT : 80  - Version : nginx
        PORT : 443 - Version : nginx
IP : 192.168.1.169
        PORT : 22 - Version : SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13.16
```

---

## Installation

### Prérequis

- Python 3.10+
- [uv](https://github.com/astral-sh/uv)
- Droits administrateur (nécessaires pour envoyer des paquets bruts)

### Installation

```bash
git clone https://github.com/julsmllr/mymap.git
cd mymap
uv sync
```

### Lancement

Sur Windows (terminal en administrateur) :
```bash
uv run main.py
```

---

## Comment ça marche

### ARP scan
ARP (Address Resolution Protocol) opère en couche 2. Pour trouver les machines actives sur le réseau local, on envoie une requête ARP en broadcast (`FF:FF:FF:FF:FF:FF`) pour chaque IP du sous-réseau. Toute machine présente répond avec sa MAC.

### SYN scan
Le SYN scan (ou *half-open scan*) envoie un paquet TCP avec le flag SYN sans compléter le handshake. C'est plus rapide et moins détectable qu'une connexion complète. Scapy permet de construire ces paquets bruts directement.

### Banner grabbing
Certains services annoncent leur version dès la connexion (SSH). D'autres attendent une requête (HTTP, RTSP). Le scanner envoie la requête adaptée selon le port, puis parse la réponse pour extraire le header `Server:`.

---

## Limitations connues

- L'interface réseau est hardcodée sur `Wi-Fi` — ne fonctionne pas tel quel sur Linux ou Mac
- Quelques faux positifs possibles sur le SYN scan 
- Les ports filtrés par pare-feu ne sont pas distingués des ports fermés
- Le scan est séquentiel machine par machine *(sera parallélisé dans une prochaine version)*

---

## Stack technique

- [Scapy](https://scapy.net/) — construction et envoi de paquets réseau
- [psutil](https://github.com/giampaolo/psutil) — détection de l'interface réseau locale
- [ipaddress](https://docs.python.org/3/library/ipaddress.html) — calcul du sous-réseau
- [socket](https://docs.python.org/3/library/socket.html) — banner grabbing

---

## Améliorations prévues

- Parallélisation du scan par machine (threading)
- Refactoring en POO
- OUI lookup pour identifier les fabricants à partir des MACs
- Détection de l'OS via le TTL
- Interface web
- Compatibilité Linux/Mac
