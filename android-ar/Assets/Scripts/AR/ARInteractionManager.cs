using System;
using UnityEngine;

namespace JHSafetyAR.AR
{
    public class ARInteractionManager : MonoBehaviour
    {
        public static ARInteractionManager Instance { get; private set; }

        public event Action<GameObject> OnObjectSelected;

        [SerializeField] private LayerMask interactableLayer;
        [SerializeField] private float maxRaycastDistance = 10f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        private void Update()
        {
            HandleTouchInput();
        }

        private void HandleTouchInput()
        {
            if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
            {
                Touch touch = Input.GetTouch(0);
                ProcessRaycast(touch.position);
            }
            else if (Input.GetMouseButtonDown(0)) // Editor testing support
            {
                ProcessRaycast(Input.mousePosition);
            }
        }

        private void ProcessRaycast(Vector2 screenPos)
        {
            if (Camera.main == null) return;

            Ray ray = Camera.main.ScreenPointToRay(screenPos);
            if (Physics.Raycast(ray, out RaycastHit hit, maxRaycastDistance, interactableLayer))
            {
                Debug.Log($"[ARInteractionManager] Hit interactable AR object: {hit.collider.gameObject.name}");
                OnObjectSelected?.Invoke(hit.collider.gameObject);
            }
        }
    }
}
