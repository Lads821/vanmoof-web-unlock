const serviceUUID = '00001816-0000-1000-8000-00805f9b34fb';
const characteristicUUID = '00002a5b-0000-1000-8000-00805f9b34fb';

let device, characteristic;

const log = (text) => {
  document.getElementById('log').textContent += text + '\n';
};

document.getElementById('connect').onclick = async () => {
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'VanMoof' }],
      optionalServices: [serviceUUID]
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);
    characteristic = await service.getCharacteristic(characteristicUUID);
    log('✅ Подключено к ' + device.name);
  } catch (err) {
    log('❌ Ошибка подключения: ' + err.message);
  }
};

document.getElementById('unlock').onclick = async () => {
  if (!characteristic) return log('⚠️ Сначала подключитесь к велосипеда!');
  const payload = new Uint8Array([0x01, 0x00, 0x00, 0x00]); // Пример команды
  try {
    await characteristic.writeValue(payload);
    log('🚀 Установлен лимит скорости 32 км/ч (US)');
  } catch (err) {
    log('❌ Ошибка записи: ' + err.message);
  }
};
