import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { BmiData } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface AddUserFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const getBmiCategory = (imc: number): string => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc >= 18.5 && imc < 25) return 'Peso normal';
    if (imc >= 25 && imc < 30) return 'Sobrepeso';
    if (imc >= 30 && imc < 35) return 'Obesidad clase I';
    if (imc >= 35 && imc < 40) return 'Obesidad clase II';
    if (imc >= 40) return 'Obesidad clase III';
    return 'Categoría no determinada';
};

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        edad: '',
        peso: '',
        altura: '',
        imc: '',
        categoria: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [calculationDone, setCalculationDone] = useState(false);
    const [showRegistrationFields, setShowRegistrationFields] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (['peso', 'altura', 'edad'].includes(name)) {
            setCalculationDone(false);
            setShowRegistrationFields(false);
            setServerError(null);
            setFormData(prev => ({ ...prev, [name]: value, imc: '', categoria: '' }));
        }
    };
    
    const validate = (fields: ('calculation' | 'registration')[]): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (fields.includes('calculation')) {
            if (!formData.edad) {
                newErrors.edad = 'La edad es obligatoria.';
            } else if (isNaN(parseInt(formData.edad)) || parseInt(formData.edad) <= 0) {
                newErrors.edad = 'Introduce una edad válida y positiva.';
            }

            if (!formData.peso) {
                newErrors.peso = 'El peso es obligatorio.';
            } else if (isNaN(parseFloat(formData.peso)) || parseFloat(formData.peso) <= 0) {
                newErrors.peso = 'Introduce un peso válido y positivo.';
            }

            if (!formData.altura) {
                newErrors.altura = 'La altura es obligatoria.';
            } else if (isNaN(parseFloat(formData.altura)) || parseFloat(formData.altura) <= 0) {
                newErrors.altura = 'Introduce una altura válida y positiva.';
            }
        }

        if (fields.includes('registration')) {
            if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
            
            if (!formData.telefono.trim()) {
                newErrors.telefono = 'El teléfono es obligatorio.';
            } else if (!/^\d{7,}$/.test(formData.telefono.replace(/\s/g, ''))) {
                newErrors.telefono = 'Introduce un número de teléfono válido.';
            }
        }
        
        setErrors(prev => ({...prev, ...newErrors}));
        return Object.keys(newErrors).length === 0;
    }


    const handleCalculate = () => {
        setServerError(null);
        if (!validate(['calculation'])) return;

        const peso = parseFloat(formData.peso);
        const altura = parseFloat(formData.altura);
        
        const alturaM = altura / 100;
        const calculatedImc = parseFloat((peso / (alturaM * alturaM)).toFixed(2));
        const calculatedCategory = getBmiCategory(calculatedImc);
        
        setFormData(prev => ({
            ...prev,
            imc: calculatedImc.toString(),
            categoria: calculatedCategory,
        }));
        setCalculationDone(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate(['calculation', 'registration'])) return;

        setIsLoading(true);
        setServerError(null);

        const { nombre, telefono, categoria } = formData;
        const edad = parseInt(formData.edad);
        const peso = parseFloat(formData.peso);
        const altura = parseFloat(formData.altura);
        const imc = parseFloat(formData.imc);
        
        const resultData: Omit<BmiData, 'id' | 'created_at'> = {
            nombre, telefono, edad, peso, altura, imc, categoria, estado: 'Nuevo',
        };
        
        try {
            const { error: supabaseError } = await supabase
                .from('registros_imc')
                .insert([resultData]);

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                throw new Error('No se pudo guardar el registro en la base de datos.');
            }
            onSuccess();

        } catch (err) {
            console.error(err);
            setServerError('Hubo un error al guardar el registro. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto animate-slide-in-right"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Calculadora y Registro</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">1. Datos para Cálculo</h3>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                        <input type="number" name="edad" value={formData.edad} onChange={handleChange} placeholder="Ej: 30" min="1" inputMode="numeric" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.edad ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`} />
                        {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                            <input type="number" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ej: 70.5" step="0.1" min="1" inputMode="decimal" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.peso ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`} />
                            {errors.peso && <p className="text-red-500 text-xs mt-1">{errors.peso}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                            <input type="number" name="altura" value={formData.altura} onChange={handleChange} placeholder="Ej: 165" min="1" inputMode="decimal" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.altura ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`} />
                            {errors.altura && <p className="text-red-500 text-xs mt-1">{errors.altura}</p>}
                        </div>
                    </div>
                    
                    {!calculationDone && (
                         <button
                            type="button"
                            onClick={handleCalculate}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Calcular IMC
                        </button>
                    )}

                    {calculationDone && (
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h3 className="text-md font-semibold text-gray-800 mb-2">Resultado</h3>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-green-600">{formData.imc}</p>
                                    <p className="text-md font-semibold text-gray-700">{formData.categoria}</p>
                                </div>
                            </div>
                            
                            {!showRegistrationFields ? (
                                <button
                                    type="button"
                                    onClick={() => setShowRegistrationFields(true)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Registrar Participante
                                </button>
                            ) : (
                                <div className="space-y-4 pt-4 border-t mt-6">
                                    <h3 className="text-lg font-semibold text-gray-700">2. Registrar Datos</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.nombre ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`} />
                                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 51987654321" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.telefono ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`} />
                                        {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                                    </div>
                                     <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400"
                                    >
                                        {isLoading ? <LoadingSpinner /> : 'Guardar Registro'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {serverError && <p className="text-red-500 text-sm text-center mt-4">{serverError}</p>}
                </form>
            </div>
            <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AddUserForm;