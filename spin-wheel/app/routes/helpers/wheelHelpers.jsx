import {Button, ColorPicker, Layout, LegacyCard, TextField} from "@shopify/polaris";
import {useState} from "react";


function ColorAndTextComponent ({index, color, setColor, textFieldValue, setText}) {
    const [colorPickerActive, setColorPickerActive] = useState(false);
  
    const toggleColorPicker = () => {
      setColorPickerActive(!colorPickerActive);
    };
  
    return (
      <Layout.Section>
        <LegacyCard title={`Change ${index} sector`} sectioned>
          <Button onClick={toggleColorPicker}>{`Change ${index} sector`}</Button>
          {colorPickerActive && (
            <>
            <TextField label={`Name of ${index} sector`} onChange={setText} value={textFieldValue} placeholder={`Enter name of ${index} sector`} autoComplete="off"/>
            <div style={{marginTop:'2%'}}>
              <ColorPicker onChange={setColor} color={color} />
            </div>
            </>
          )}
        </LegacyCard>
      </Layout.Section>
    );
  };
  
function HSBToRGB (h, s, b) {
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return `rgb(${255 * f(5)},${255 * f(3)},${255 * f(1)})`;
};
  
function findValueByNamespaceAndKey(data, targetNamespace, targetKey) {
  for (let i = 0; i < data.length; i++) {
  const node = data[i].node;
  if (node.namespace === targetNamespace && node.key === targetKey) {
    return node.value;
  }
  }
  return null; // Возвращаем null, если значение не найдено
}

export {findValueByNamespaceAndKey, HSBToRGB, ColorAndTextComponent};