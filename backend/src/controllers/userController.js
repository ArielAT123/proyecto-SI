import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';

export const listUsers = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const { role } = req.query;
    const users = await userService.listAllUsers(role);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (req.user.id !== userId && req.user.role === 'CLIENT') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const profile = await authService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const rechargeWallet = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (req.user.id !== userId && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Monto de recarga inválido' });
  }
  try {
    const safeUser = await userService.rechargeUserWallet(userId, amount);
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere perfil administrador.' });
  }
  const userId = parseInt(req.params.id);
  const { name, email, role, password, restaurantId } = req.body;
  try {
    const updated = await userService.updateUserData(userId, { name, email, role, password, restaurantId });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
