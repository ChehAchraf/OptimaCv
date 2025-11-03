                                          

import requests

from backend.core.config import settings

from typing import Optional



ESP_BASE_URL = settings.ESP32_IP_ADDRESS



def notify_esp32(status: str, score: Optional[int] = None):

    """
    Envoie une notification (fire-and-forget) à l'ESP32.
    Status peut être: 'busy', 'success', 'error', 'idle'
    """

    if not ESP_BASE_URL:

        print("Alerte: ESP32_IP_ADDRESS non configuré. Notification ignorée.")

        return



                                            

    params = {}

    if status == "success" and score is not None:

        params = {"score": score}

                                   

    

    try:

        url = f"{ESP_BASE_URL}/{status}"

        requests.get(url, params=params, timeout=1.0)                              

        print(f"--- 💡 ESP32 Notification envoyée: {status} avec params: {params} ---")

    

    except requests.exceptions.RequestException as e:

        print(f"--- ⚠️ ESP32 Notification échouée: {e} ---")
