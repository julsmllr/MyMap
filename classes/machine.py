class Machine():
    def __init__(self):
        self.name = ""
        self.ip = ""
        self.mac = ""
        self.ports = []
        self.fabricant = ""
        self.os = ""
    
    def afficherIpMac(self):
        print(f"{self.ip} - {self.mac}")
        
    def afficherPorts(self):
        print(f"{self.name} - {self.ip} - {self.mac}")
        print(f"Liste des ports :")
        for port in self.ports:
            port.afficherPort()
        print("-------------\n")