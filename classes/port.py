import enum
from constantes import NOM_PORTS

class EtatPort(enum.Enum):
    OUVERT = "ouvert"
    FERME = "ferme"
    FILTRE = "filtre"

class Port():
    def __init__(self, numero, etat:EtatPort):
        self.numero = numero
        self.name = NOM_PORTS[numero] if numero in NOM_PORTS.keys() else ""
        self.etat = etat
        self.banner = ""
    
    def afficherPort(self):
        print(f"\t- {self.numero} ({self.name}) - {self.banner} - ETAT = {self.etat}")