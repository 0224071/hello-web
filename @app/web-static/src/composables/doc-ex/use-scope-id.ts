import { type ConcreteComponent, getCurrentInstance } from 'vue'

type ConcreteComponentWithScopeId = ConcreteComponent & { __scopeId: string | undefined }
export function useScopeId() {
  const instance = getCurrentInstance()

  // 當前組件的 scope id
  const scopeId = instance?.vnode.scopeId
  // 父組件的 scope id，也就是使用 Teleport 和 Fragment 當根元素時，傳不進來的 scope id
  const parentScopedId = (instance?.parent?.type as ConcreteComponentWithScopeId).__scopeId

  return {
    parentScopedId,
    scopeId,
  }
}
