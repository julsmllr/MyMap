from scapy.layers.l2 import Ether, ARP, srp
from scapy.layers.inet import IP, TCP, sr
import psutil, ipaddress, socket, threading


from constantes import *
from classes.machine import Machine
from classes.port import Port, EtatPort

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
    lstMachine = []
    for requete in reponse:
        ip, mac = requete.answer[ARP].psrc, requete.answer[ARP].hwsrc
        newMachine = Machine()
        newMachine.ip = ip
        newMachine.mac = mac
        lstMachine.append(newMachine)
        
        
        
    print(f"{'IP':<20} {'MAC'}")
    print("-" * 40) 
    for machine in lstMachine:
        machine.afficherIpMac()
        
    # Scan des ports : 
    print("\n----------------------------- SCAN DES PORTS -----------------------------")
     
    threads = []
    for machine in lstMachine:
        t = threading.Thread(target=scanPortMachine, args=(machine,))
        threads.append(t)
        t.start()
        
    for t in threads:
        t.join()
    
    for machine in lstMachine:
        machine.afficherPorts()

def scanPortMachine(machine: Machine):
    lst_packet_TCP = [Ether(dst = machine.mac)/IP(dst = machine.ip)/TCP(dport = j, flags="S") for j in range(1, 1025)] #Pour avoir des objets différents et pas un même pointeur sur chaque packet sur chaque port
    rep, non_rep = srp(lst_packet_TCP, timeout=5, verbose=0)
    for j in range(len(rep)):
        if rep[j][1]["TCP"].flags == "SA":
            newPort = Port(rep[j][0][TCP].dport, EtatPort.OUVERT)
            machine.ports.append(newPort)
    versionning(machine.ip, machine.ports)    
    

def versionning(ip, listPorts:list):
    #D'après cet article : https://medium.com/@rajesh.p3807/building-a-simple-python-banner-grabbing-script-a-step-by-step-guide-6538f2d26804
    if len(listPorts) > 0:
        for port in listPorts:
            banner(ip, port)
    
    
def banner(ip, port):
    sck = socket.socket()
    sck.settimeout(5)
    sck.connect((ip, port.numero))
    try:
        if port.numero in REQUETES_PORTS.keys():
            sck.send(REQUETES_PORTS[port.numero])
            version = sck.recv(1024).decode().strip().split("\r\n")
            for ligne in version:
                if ligne.lower()[0:7] == "server:":
                    port.banner = ligne[7:]
                    
        else:                
            version = sck.recv(1024).decode().strip()
            port.banner = version
                    
    except (TimeoutError, ConnectionRefusedError):
        port.banner = "Pas de bannière"
    finally:
        sck.close()


if __name__ == "__main__":
    main()