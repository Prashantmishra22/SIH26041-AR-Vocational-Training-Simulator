using UnityEngine;

namespace JHSafetyAR.Offline
{
    public class CacheManager : MonoBehaviour
    {
        public static CacheManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public bool AreModulesCached()
        {
            // All training modules and JSON questions are bundled inside Assets/Resources/
            return true;
        }
    }
}
