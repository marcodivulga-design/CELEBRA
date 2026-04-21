import mysql from 'mysql2/promise';

const connectionString = process.env.DATABASE_URL;

async function executeMigration() {
  const connection = await mysql.createConnection(connectionString);
  
  try {
    console.log('🚀 FASE 2: Migração de Dados - Iniciando...\n');
    
    // 1. Adicionar coluna organizationId às tabelas (se não existir)
    console.log('1️⃣ Adicionando coluna organizationId às tabelas...');
    const tables = ['celebrations', 'readings', 'teams', 'songs'];
    
    for (const table of tables) {
      try {
        await connection.execute(`
          ALTER TABLE ${table} 
          ADD COLUMN organizationId INT NULL
        `);
        console.log(`   ✓ ${table}: coluna adicionada`);
      } catch (e) {
        if (e.message.includes('Duplicate column')) {
          console.log(`   ℹ ${table}: coluna já existe`);
        } else {
          console.log(`   ⚠ ${table}: ${e.message.substring(0, 60)}`);
        }
      }
    }
    
    // 2. Criar índices
    console.log('\n2️⃣ Criando índices para performance...');
    for (const table of tables) {
      try {
        await connection.execute(`
          CREATE INDEX idx_${table}_organizationId 
          ON ${table}(organizationId)
        `);
        console.log(`   ✓ ${table}: índice criado`);
      } catch (e) {
        if (e.message.includes('Duplicate key name')) {
          console.log(`   ℹ ${table}: índice já existe`);
        } else {
          console.log(`   ⚠ ${table}: ${e.message.substring(0, 60)}`);
        }
      }
    }
    
    // 3. Criar organização padrão para cada usuário
    console.log('\n3️⃣ Criando organizações padrão para usuários...');
    const [users] = await connection.execute('SELECT id, name FROM users');
    
    for (const user of users) {
      try {
        const slug = `org-${user.id}-${Date.now()}`;
        await connection.execute(
          `INSERT INTO organizations (name, slug, plan, ownerId) 
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
          [`${user.name} - Org`, slug, 'free', user.id]
        );
      } catch (e) {
        console.log(`   ⚠ Usuário ${user.id}: ${e.message.substring(0, 60)}`);
      }
    }
    console.log(`   ✓ ${users.length} organizações criadas/atualizadas`);
    
    // 4. Adicionar usuários às suas organizações
    console.log('\n4️⃣ Adicionando usuários às organizações...');
    const [orgs] = await connection.execute(
      'SELECT id, ownerId FROM organizations'
    );
    
    let addedCount = 0;
    for (const org of orgs) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO organizationUsers (organizationId, userId, role) 
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
          [org.id, org.ownerId, 'owner']
        );
        if (result.affectedRows > 0) addedCount++;
      } catch (e) {
        console.log(`   ⚠ Org ${org.id}: ${e.message.substring(0, 60)}`);
      }
    }
    console.log(`   ✓ ${addedCount} usuários adicionados`);
    
    // 5. Atualizar dados históricos com organizationId
    console.log('\n5️⃣ Atualizando dados históricos com organizationId...');
    
    // Celebrações
    try {
      const [result] = await connection.execute(`
        UPDATE celebrations c
        SET c.organizationId = (
          SELECT o.id FROM organizations o 
          WHERE o.ownerId = c.createdBy 
          LIMIT 1
        )
        WHERE c.organizationId IS NULL AND c.createdBy IS NOT NULL
      `);
      console.log(`   ✓ Celebrações: ${result.affectedRows} atualizadas`);
    } catch (e) {
      console.log(`   ⚠ Celebrações: ${e.message.substring(0, 60)}`);
    }
    
    // Readings
    try {
      const [result] = await connection.execute(`
        UPDATE readings r
        SET r.organizationId = (
          SELECT c.organizationId FROM celebrations c 
          WHERE c.id = r.celebrationId 
          LIMIT 1
        )
        WHERE r.organizationId IS NULL AND r.celebrationId IS NOT NULL
      `);
      console.log(`   ✓ Readings: ${result.affectedRows} atualizadas`);
    } catch (e) {
      console.log(`   ⚠ Readings: ${e.message.substring(0, 60)}`);
    }
    
    // Teams
    try {
      const [result] = await connection.execute(`
        UPDATE teams t
        SET t.organizationId = (
          SELECT c.organizationId FROM celebrations c 
          WHERE c.id = t.celebrationId 
          LIMIT 1
        )
        WHERE t.organizationId IS NULL AND t.celebrationId IS NOT NULL
      `);
      console.log(`   ✓ Teams: ${result.affectedRows} atualizadas`);
    } catch (e) {
      console.log(`   ⚠ Teams: ${e.message.substring(0, 60)}`);
    }
    
    // 6. Criar subscrição padrão para cada organização
    console.log('\n6️⃣ Criando subscrições padrão...');
    try {
      const [result] = await connection.execute(`
        INSERT INTO subscriptions (organizationId, plan, status)
        SELECT o.id, o.plan, 'active'
        FROM organizations o
        WHERE NOT EXISTS (
          SELECT 1 FROM subscriptions s 
          WHERE s.organizationId = o.id
        )
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
      `);
      console.log(`   ✓ Subscrições: ${result.affectedRows} criadas`);
    } catch (e) {
      console.log(`   ⚠ Subscrições: ${e.message.substring(0, 60)}`);
    }
    
    // 7. Validar integridade
    console.log('\n7️⃣ Validando integridade dos dados...');
    const [issues] = await connection.execute(`
      SELECT 
        'Celebrações sem org' as issue, COUNT(*) as count 
      FROM celebrations WHERE organizationId IS NULL
      UNION ALL
      SELECT 'Readings sem org', COUNT(*) 
      FROM readings WHERE organizationId IS NULL
      UNION ALL
      SELECT 'Teams sem org', COUNT(*) 
      FROM teams WHERE organizationId IS NULL
    `);
    
    let hasIssues = false;
    for (const issue of issues) {
      if (issue.count > 0) {
        console.log(`   ⚠ ${issue.issue}: ${issue.count}`);
        hasIssues = true;
      }
    }
    
    if (!hasIssues) {
      console.log('   ✓ Todos os dados estão íntegros!');
    }
    
    console.log('\n✅ FASE 2 CONCLUÍDA COM SUCESSO!\n');
    
  } catch (error) {
    console.error('❌ Erro crítico:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

executeMigration();
