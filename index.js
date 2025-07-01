const serviceUUID = '00001816-0000-1000-8000-00805f9b34fb';
const characteristicUUID = '00002a5b-0000-1000-8000-00805f9b34fb';

let device, characteristic;

const log = (text) => {
  const logEl = document.getElementById('log');
  logEl.textContent += text + '\n';
  logEl.scrollTop = logEl.scrollHeight;
};

document.getElementById('connect').onclick = async () => {
  try {
    log('🔍 Поиск велосипеда...');
    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'VanMoof' }],
      optionalServices: [serviceUUID]
    });
    log(`🔗 Подключение к ${device.name}...`);
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);
    characteristic = await service.getCharacteristic(characteristicUUID);
    log('✅ Подключение успешно установлено!');
  } catch (err) {
    log('❌ Ошибка подключения: ' + err.message);
  }
};

async function setSpeedLimit(payload, label) {
  if (!characteristic) {
    log('⚠️ Сначала подключитесь к велосипеду!');
    return;
  }
  try {
    await characteristic.writeValue(new Uint8Array(payload));
    log(`✅ ${label} установлен`);
  } catch (err) {
    log('❌ Ошибка установки: ' + err.message);
  }
}

document.getElementById('set25').onclick = () => {
  setSpeedLimit([0x00, 0x00, 0x00, 0x00], 'Лимит 25 км/ч');
};

document.getElementById('set32').onclick = () => {
  setSpeedLimit([0x01, 0x00, 0x00, 0x00], 'Лимит 32 км/ч');
};
