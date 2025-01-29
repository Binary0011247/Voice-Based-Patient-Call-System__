class keyword:
    def __init__(self):
        self.medical_keywords={
            "chest pain": ["chest pain", "chest ache", "tightness in chest", "heart pain", "pressure in chest","chest"],
            "allergy":["itching","allergy"],
            "stomach pain": ["stomach pain", "abdominal pain", "belly ache", "tummy ache", "gas pain", "cramps in stomach"],
            "headache": ["headache", "head pain", "migraine", "throbbing head", "pounding headache"],
            "back pain": ["back pain", "lower back pain", "spinal pain", "ache in back"],
            "joint pain": ["joint pain", "arthritis pain", "pain in knees", "elbow pain", "shoulder pain"],
            "muscle pain": ["muscle pain", "body ache", "sore muscles", "cramps", "muscle stiffness"],
            "leg pain": ["leg pain", "calf pain", "thigh pain", "knee ache", "shin pain"],
            "arm pain": ["arm pain", "forearm ache", "upper arm pain", "wrist pain", "elbow ache"],
            "neck pain": ["neck pain", "stiff neck", "pain in neck", "sore neck"],
            "general pain": ["pain", "ache", "discomfort", "throbbing", "stiffness", "sharp pain", "dull ache"],
            "water bottle": ["water bottle", "bottle of water", "hydration bottle", "drinking bottle","water"],
            "medicine": ["medicine", "tablet", "pill", "capsule", "syrup", "antibiotic", "painkiller"],
            "first aid": ["first aid", "emergency kit", "aid kit", "medical kit"],
            "oxygen mask": ["oxygen mask", "breathing mask", "oxygen supply"],
            "bandage": ["bandage", "gauze", "medical wrap", "dressing"],
        }

    def indentifier(self,text):
        found_items = []
        for key, variants in self.medical_keywords.items():
            for variant in variants:
                if variant in text.lower():
                    found_items.append(key)
                    break 
        
        print(found_items)

        word="".join(found_items)
        print(word)
        return word
    

keywordindentifier=keyword()