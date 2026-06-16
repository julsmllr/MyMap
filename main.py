from scapy.layers.l2 import Ether, ARP, srp
import psutil, ipaddress


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
    trame.show()
    
    # Envoi de la trame
    reponse, nonrep = srp(trame, timeout=3)
    
    
    print("Réponses")
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
   
    
    
if __name__ == "__main__":
    main()