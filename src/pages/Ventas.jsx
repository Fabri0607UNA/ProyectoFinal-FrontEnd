import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VentaForm from '../components/VentaForm';
import { FaPlus } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import { formatCurrency } from '../utils/formatCurrency';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchVentas = useCallback(() => {
    setIsLoading(true);
    api.get('/Venta')
      .then(res => {
        const sortedVentas = res.data.sort((a, b) =>
          (b.numeroFactura || b.NumeroFactura).localeCompare(a.numeroFactura || a.NumeroFactura)
        );
        setVentas(sortedVentas);
      })
      .catch(() => toast.error('Error al cargar ventas'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = ventas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Ventas</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Nueva Venta
        </button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Lista de Ventas
        </h3>
        {isLoading ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            Cargando ventas...
          </p>
        ) : ventas.length === 0 ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            No hay ventas
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                    <th className="p-4 rounded-tl-lg min-w-[120px]">
                      Número Factura
                    </th>
                    <th className="p-4 min-w-[120px]">Fecha</th>
                    <th className="p-4 min-w-[120px]">Método Pago</th>
                    <th className="p-4 text-right min-w-[120px]">Total</th>
                    <th className="p-4 min-w-[120px]">Estado</th>
                    <th className="p-4 rounded-tr-lg min-w-[100px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVentas.map((venta, index) => (
                    <tr
                      key={venta.ventaId || venta.VentaId}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {venta.numeroFactura || venta.NumeroFactura || '-'}
                      </td>
                      <td className="p-4 text-gray-800">
                        {(venta.fechaVenta || venta.FechaVenta)
                          ? new Date(venta.fechaVenta || venta.FechaVenta).toLocaleDateString('es-CR')
                          : '-'}
                      </td>
                      <td className="p-4 text-gray-800">{venta.metodoPago || venta.MetodoPago || '-'}</td>
                      <td className="p-4 text-right text-gray-800">
                        {formatCurrency(venta.total || venta.Total || 0)}
                      </td>
                      <td className="p-4 text-gray-800">{venta.estadoVenta || venta.EstadoVenta || '-'}</td>
                      <td className="p-4">
                        <Link to={`/ventas/${venta.ventaId || venta.VentaId}`} className="text-blue-500">
                          Ver Detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={ventas.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
      {showModal && (
        <VentaForm
          onClose={() => setShowModal(false)}
          onSave={(newVenta) => {
            setVentas([newVenta, ...ventas]);
            setShowModal(false);
            fetchVentas();
          }}
        />
      )}
    </div>
  );
}

export default Ventas;