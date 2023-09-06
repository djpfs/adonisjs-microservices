import Ms, { TransportMethods } from '@ioc:Microservice/Transports'

export default function Message(topic: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const splitedTopic = topic.split('.')
    if (splitedTopic.length < 2) throw new Error('Invalid topic, must be like: kafka.topic')
    const method = splitedTopic[0] as TransportMethods
    const topicListener = splitedTopic.slice(1).join('.')
    Ms.addListener(method, topicListener, originalMethod)
    return descriptor
  }
}
