using UnityEngine;

namespace JHSafetyAR.Core
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioSource voiceSource;

        [Header("SFX Clips")]
        [SerializeField] private AudioClip successClip;
        [SerializeField] private AudioClip errorClip;
        [SerializeField] private AudioClip alarmClip;
        [SerializeField] private AudioClip buttonClickClip;
        [SerializeField] private AudioClip certificateFanfareClip;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            if (sfxSource == null) sfxSource = gameObject.AddComponent<AudioSource>();
            if (voiceSource == null) voiceSource = gameObject.AddComponent<AudioSource>();
        }

        public void PlayButtonClick()
        {
            if (buttonClickClip != null && sfxSource != null)
                sfxSource.PlayOneShot(buttonClickClip, 0.7f);
        }

        public void PlaySuccess()
        {
            if (successClip != null && sfxSource != null)
                sfxSource.PlayOneShot(successClip, 1.0f);
        }

        public void PlayError()
        {
            if (errorClip != null && sfxSource != null)
                sfxSource.PlayOneShot(errorClip, 1.0f);
        }

        public void PlayHazardAlarm()
        {
            if (alarmClip != null && sfxSource != null)
                sfxSource.PlayOneShot(alarmClip, 0.9f);
        }

        public void PlayCertificateFanfare()
        {
            if (certificateFanfareClip != null && sfxSource != null)
                sfxSource.PlayOneShot(certificateFanfareClip, 1.0f);
        }
    }
}
