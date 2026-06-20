from scapy.layers.l2 import Ether, ARP, srp
from scapy.layers.inet import IP, TCP, sr
import psutil, ipaddress, socket, threading
from constantes import *

def getNetwork():
    dico = psutil.net_if_addrs()

    ip = dico["Wi-Fi"][1][1]
    mask = dico["Wi-Fi"][1][2]

    network = ipaddress.IPv4Network(f'{ip}/{mask}', strict=False)
    return str(network)
    
def main():
    
    # Création de la trame
    trame = Ether()
    
    #Modification de la destionation
    trame.dst = "FF:FF:FF:FF:FF:FF" 
    
    #On ajoute la couche ARP
    trame = trame / ARP() 
    
    #Ajout de l'IP Réseau (il enverra à chaque ip)
    trame.pdst = getNetwork()
    # trame.show()
    print("Scan des ips en cours (10sec...)")
    # Envoi de la trame
    reponse, nonrep = srp(trame, timeout=10, verbose=0)
    
    
    print("----------------------------- SCAN DES MACs -----------------------------")
    # Résumé global
    # reponse.summary(lambda s,r: r.sprintf("%Ether.src% %ARP.psrc%"))
    
    
    # Création du dico
    dicoReponse = {}
    for requete in reponse:
        ip, mac = requete.answer[ARP].psrc, requete.answer[ARP].hwsrc
        dicoReponse[ip] = mac
        
        
    print(f"{'IP':<20} {'MAC'}")
    print("-" * 40) 
    for i, j in dicoReponse.items():
        print(f"{i} - {j}")
        
    # Scan des ports : 
    print("\n----------------------------- SCAN DES PORTS -----------------------------")
    
    for k, v in dicoReponse.items():
        dicoReponse[k] = {"MAC" : v, "PORTS" : []}        
        
    for i in dicoReponse.keys():
        lst_packet_TCP = [IP(dst = i)/TCP(dport = j, flags="S") for j in range(1, 1025)] #Pour avoir des objets différents et pas un même pointeur sur chaque packet sur chaque port
        rep, non_rep = sr(lst_packet_TCP, timeout=5, verbose=0)
        for j in range(len(rep)):
            if rep[j][1]["TCP"].flags == "SA":
                dicoReponse[i]["PORTS"].append(rep[j][0][TCP].dport)
        versionning(i, dicoReponse[i]["PORTS"])    
    

def versionning(ip, listPorts:list):
    #D'après cet article : https://medium.com/@rajesh.p3807/building-a-simple-python-banner-grabbing-script-a-step-by-step-guide-6538f2d26804
    if len(listPorts) > 0:
        print(f"IP : {ip}")
        for port in listPorts:
            print(f"\tPORT : {port} - ", end="")
            banner(ip, port)
    
    
def banner(ip, port):
    sck = socket.socket()
    sck.settimeout(5)
    sck.connect((ip, port))
    try:
        if port in REQUETES_PORTS.keys():
            sck.send(REQUETES_PORTS[port])
            version = sck.recv(1024).decode().strip().split("\r\n")
            for ligne in version:
                if ligne.lower()[0:7] == "server:":
                    print(f"Version : {ligne[7:]}", end="\n")
                    
        else:                
            version = sck.recv(1024).decode().strip()
            print(f"Version : {version}")
                    
    except (TimeoutError, ConnectionRefusedError):
        print("Pas de banniere")
    finally:
        sck.close()


if __name__ == "__main__":
    main()